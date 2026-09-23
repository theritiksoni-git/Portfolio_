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

app.post("/submitFormData", (req, res) => {
  const { Name, email, Message, projectType } = req.body;
  console.log(`[Form Submission Received] Name: ${Name}, Email: ${email}, Message: ${Message}`);

  if (isDbConnected && connection) {
    const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
    connection.query(sql, [Name, email, Message], (err, result) => {
      if (err) {
        console.error("Error inserting data into the database:", err);
      } else {
        console.log("Data inserted into the database");
      }
    });
  }

  if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your-email')) {
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Form Submission: ${Name} [${projectType || 'General'}]`,
      text: `You have received a new form submission from ${Name} (${email}).\n\nProject Type: ${projectType || 'General'}\n\nMessage: ${Message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  res.json({ success: true, message: "Transmission received successfully" });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
