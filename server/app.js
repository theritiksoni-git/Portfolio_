const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const session = require("express-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

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
        console.warn("MySQL database offline. Server running in standalone API mode.");
        isDbConnected = false;
      } else {
        console.log("Connected to the MySQL database");
        isDbConnected = true;
      }
    });

    connection.on('error', (err) => {
      isDbConnected = false;
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        setTimeout(handleDisconnect, 10000);
      }
    });
  } catch (e) {
    isDbConnected = false;
  }
}

handleDisconnect();

app.get("/AdminHome", (req, res) => {
  if (req.session.user) {
    res.json({ success: true, admin: req.session.user });
  } else {
    res.json({ success: false });
  }
});

app.post("/newsletter", (req, res) => {
  const { email } = req.body;

  const checkEmailQuery = "SELECT * FROM newsletter WHERE email = ?";
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error("Error checking email in the database:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      if (results.length > 0) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        const insertEmailQuery = "INSERT INTO newsletter (email) VALUES (?)";
        connection.query(insertEmailQuery, [email], (err, result) => {
          if (err) {
            console.error("Error inserting data into the database:", err);
            res.status(500).json({ error: "Internal server error" });
          } else {
            console.log("Data inserted into the database");
            res.json({ success: true });
          }
        });
      }
    }
  });
});

app.post("/admin/login", (req, res) => {
  const { Admin, password } = req.body;

  if (
    Admin === process.env.ADMIN_ADMIN &&
    password === process.env.ADMIN_PASSWORD
  ) {
    req.session.isLoggedIn = true;
    req.session.user = { admin: req.body.Admin };
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const path = require("path");
const fs = require("fs");
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const DATA_FILE = path.join(__dirname, "portfolio_data.json");

app.post("/submitFormData", (req, res) => {
  const { Name, email, Message, projectType, targetEmail } = req.body;
  const newMsg = {
    id: `msg-${Date.now()}`,
    name: Name || "Anonymous",
    email: email || "unknown@domain.com",
    projectType: projectType || "General Inquiry",
    message: Message || "",
    receivedAt: new Date().toISOString(),
  };

  console.log(`[Form Submission Received] Name: ${newMsg.name}, Email: ${newMsg.email}, Project: ${newMsg.projectType}`);

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

  // 3. Nodemailer dispatch if SMTP configured
  const recipient = targetEmail || process.env.EMAIL_USER || "theritiksoni@gmail.com";
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && !emailUser.includes('your-email') && emailPass && !emailPass.includes('your-app-password')) {
    const mailOptions = {
      from: `"${newMsg.name} via Portfolio" <${emailUser}>`,
      replyTo: newMsg.email,
      to: recipient,
      subject: `🎬 New Portfolio Inquiry: ${newMsg.name} [${newMsg.projectType}]`,
      text: `You have received a new form submission on your portfolio website:\n\nClient Name: ${newMsg.name}\nClient Email: ${newMsg.email}\nProject Type: ${newMsg.projectType}\nReceived: ${new Date().toLocaleString()}\n\nMessage:\n${newMsg.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #0891b2; border-radius: 12px; background: #09090b; color: #f4f4f5;">
          <h2 style="color: #38bdf8; margin-top: 0; font-family: sans-serif;">🎬 New Client Inquiry Transmitted</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr><td style="padding: 8px; color: #a1a1aa; width: 120px; border-bottom: 1px solid #27272a;">Client:</td><td style="padding: 8px; color: #ffffff; font-weight: bold; border-bottom: 1px solid #27272a;">${newMsg.name}</td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #27272a;"><a href="mailto:${newMsg.email}" style="color: #38bdf8;">${newMsg.email}</a></td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Project Type:</td><td style="padding: 8px; color: #ffffff; border-bottom: 1px solid #27272a;">${newMsg.projectType}</td></tr>
            <tr><td style="padding: 8px; color: #a1a1aa; border-bottom: 1px solid #27272a;">Timestamp:</td><td style="padding: 8px; color: #71717a; border-bottom: 1px solid #27272a;">${new Date().toLocaleString()}</td></tr>
          </table>
          <h3 style="color: #e4e4e7; margin-bottom: 8px; font-size: 14px;">Project Vision & Details:</h3>
          <div style="background: #18181b; padding: 16px; border-radius: 8px; border: 1px solid #27272a; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e4e4e7;">${newMsg.message}</div>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #27272a; font-size: 12px; color: #a1a1aa;">
            Tip: Replying directly to this email will reply straight to <strong>${newMsg.email}</strong>.
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

  res.json({ success: true, message: "Transmission received and logged successfully", messageId: newMsg.id });
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
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.post("/api/portfolio-data", (req, res) => {
  try {
    const payload = req.body;
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
    console.log("[Portfolio Data] Synced directly from Admin to server disk.");
    return res.json({ success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("Error writing portfolio data:", err);
    res.status(500).json({ error: "Failed to write data" });
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
