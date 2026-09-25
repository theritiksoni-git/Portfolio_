const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// Body Parser with payload size limitations to mitigate DoS
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));

// Restrict CORS origins to trusted development & production domains
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.ritiksoni.in",
  "https://ritiksoni.in",
  process.env.CLIENT_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  methods: ["POST", "GET"],
  credentials: true
}));

// Session configuration with security flags and strong fallback
const sessionSecret = process.env.SESSION_SECRET || "RS_PORTFOLIO_AUTH_SEC_889210_RITIK";
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  })
);

// HTML Entity escaping utility to prevent Email & HTML Injection
function escapeHtml(unsafe) {
  if (!unsafe || typeof unsafe !== "string") return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In-Memory Rate Limiter to prevent brute-force attacks and form spam
const ipRequestTracker = new Map();
function rateLimit(maxRequests = 10, windowMinutes = 5) {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "client-ip";
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;

    const record = ipRequestTracker.get(ip) || { count: 0, resetTime: now + windowMs };
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }
    ipRequestTracker.set(ip, record);

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please wait a few minutes before trying again."
      });
    }
    next();
  };
}

// Authentication Middleware for Protected Routes
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const serverApiKey = process.env.SERVER_API_KEY;

  if (req.session && req.session.isLoggedIn) {
    return next();
  }

  if (serverApiKey && authHeader === `Bearer ${serverApiKey}`) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized: Admin session required" });
}

let isDbConnected = false;
let connection;

function handleDisconnect() {
  try {
    connection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "portfolio",
    });

    connection.connect((err) => {
      if (err) {
        console.warn("MySQL database offline. Server running in standalone file storage mode.");
        isDbConnected = false;
      } else {
        console.log("Connected to the MySQL database");
        isDbConnected = true;
      }
    });

    connection.on("error", (err) => {
      isDbConnected = false;
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        setTimeout(handleDisconnect, 10000);
      }
    });
  } catch (e) {
    isDbConnected = false;
  }
}

handleDisconnect();

app.get("/AdminHome", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, admin: req.session.user });
  } else {
    res.json({ success: false });
  }
});

app.post("/newsletter", rateLimit(5, 10), (req, res) => {
  const email = String(req.body.email || "").trim().slice(0, 150);
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  if (!isDbConnected || !connection) {
    return res.json({ success: true, message: "Subscription logged in standalone mode" });
  }

  const checkEmailQuery = "SELECT * FROM newsletter WHERE email = ?";
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking email in the database:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const insertEmailQuery = "INSERT INTO newsletter (email) VALUES (?)";
    connection.query(insertEmailQuery, [email], (insertErr) => {
      if (insertErr) {
        console.error("Error inserting data into the database:", insertErr);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.json({ success: true });
    });
  });
});

app.post("/admin/login", rateLimit(10, 5), (req, res) => {
  const { Admin, password } = req.body || {};

  const expectedAdmin = process.env.ADMIN_ADMIN;
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (!expectedAdmin || !expectedPass) {
    console.error("ADMIN_ADMIN or ADMIN_PASSWORD environment variables are not configured.");
    return res.status(500).json({ success: false, error: "Server authentication credentials not configured on host." });
  }

  if (
    typeof Admin === "string" &&
    typeof password === "string" &&
    Admin.trim() === expectedAdmin.trim() &&
    password === expectedPass
  ) {
    req.session.isLoggedIn = true;
    req.session.user = { admin: Admin.trim() };
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: "Invalid credentials" });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const MESSAGES_FILE = path.join(__dirname, "messages.json");
const DATA_FILE = path.join(__dirname, "portfolio_data.json");

app.post("/submitFormData", rateLimit(6, 10), (req, res) => {
  const { Name, email, Message, projectType, targetEmail } = req.body || {};

  const sanitizedName = String(Name || "").trim().slice(0, 100);
  const sanitizedEmail = String(email || "").trim().slice(0, 150);
  const sanitizedProjectType = String(projectType || "General Inquiry").trim().slice(0, 100);
  const sanitizedMessage = String(Message || "").trim().slice(0, 4000);

  const newMsg = {
    id: `msg-${Date.now()}`,
    name: sanitizedName || "Anonymous Client",
    email: sanitizedEmail || "unknown@domain.com",
    projectType: sanitizedProjectType,
    message: sanitizedMessage,
    receivedAt: new Date().toISOString(),
  };

  console.log(`[Form Submission Received] Name: ${newMsg.name}, Email: ${newMsg.email}`);

  // 1. Persist to messages.json on server disk
  try {
    let existing = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8") || "[]");
    }
    existing.unshift(newMsg);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), "utf-8");
  } catch (fsErr) {
    console.error("Error writing messages.json:", fsErr);
  }

  // 2. MySQL backup if connected
  if (isDbConnected && connection) {
    const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    connection.query(sql, [newMsg.name, newMsg.email, `[${newMsg.projectType}] ${newMsg.message}`], (err) => {
      if (err) console.error("Error inserting data into MySQL messages:", err);
    });
  }

  // 3. Nodemailer dispatch with strict HTML escaping
  const recipient = targetEmail || process.env.EMAIL_USER || "theritiksoni@gmail.com";
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && !emailUser.includes("your-email") && emailPass && !emailPass.includes("your-app-password")) {
    const safeName = escapeHtml(newMsg.name);
    const safeEmail = escapeHtml(newMsg.email);
    const safeProject = escapeHtml(newMsg.projectType);
    const safeMsg = escapeHtml(newMsg.message);

    const mailOptions = {
      from: `"${newMsg.name.replace(/["\r\n]/g, "")} via Portfolio" <${emailUser}>`,
      replyTo: newMsg.email.replace(/[\r\n]/g, ""),
      to: recipient.replace(/[\r\n]/g, ""),
      subject: `🎬 New Portfolio Inquiry: ${safeName} [${safeProject}]`,
      text: `You have received a new form submission on your portfolio website:\n\nClient Name: ${newMsg.name}\nClient Email: ${newMsg.email}\nProject Type: ${newMsg.projectType}\nReceived: ${new Date().toLocaleString()}\n\nMessage:\n${newMsg.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #0891b2; border-radius: 12px; background: #09090b; color: #f4f4f5;">
          <h2 style="color: #38bdf8; margin-top: 0; font-family: sans-serif;">🎬 New Client Inquiry Transmitted</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr><td style="padding: 8px; color: #a1a1aa; width: 120px; border-bottom: 1px solid #27272a;">Client:</td><td style="padding: 8px; color: #ffffff; font-weight: bold; border-bottom: 1px solid #27272a;">${safeName}</td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${safeEmail}" style="color: #38bdf8;">${safeEmail}</a></td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Project Type:</td><td style="padding: 8px; color: #ffffff; border-bottom: 1px solid #27272a;">${safeProject}</td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Timestamp:</td><td style="padding: 8px; color: #71717a; border-bottom: 1px solid #27272a;">${new Date().toLocaleString()}</td></tr>
          </table>
          <h3 style="color: #e4e4e7; margin-bottom: 8px; font-size: 14px;">Project Vision & Details:</h3>
          <div style="background: #18181b; padding: 16px; border-radius: 8px; border: 1px solid #27272a; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e4e4e7;">${safeMsg}</div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 12px; color: #a1a1aa;">
            Tip: Replying directly to this email will reply straight to <strong>${safeEmail}</strong>.
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email via Nodemailer:", error);
      } else {
        console.log("Email sent successfully via Nodemailer:", info.response);
      }
    });
  }

  return res.json({ success: true, message: "Transmission received and logged successfully", messageId: newMsg.id });
});

// Dynamic Portfolio Data Synchronization & Persistence Engine
app.get("/api/portfolio-data", (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return res.json({ success: true, data: JSON.parse(raw) });
    }
    return res.json({ success: true, data: null });
  } catch (err) {
    console.error("Error reading portfolio data:", err);
    return res.status(500).json({ error: "Failed to read data" });
  }
});

// PROTECTED: Only authenticated admin sessions or authorized backend tokens can overwrite data
app.post("/api/portfolio-data", requireAdminAuth, (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ error: "Invalid payload format" });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
    console.log("[Portfolio Data] Synced securely to server disk.");
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Error writing portfolio data:", err);
    return res.status(500).json({ error: "Failed to write data" });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
