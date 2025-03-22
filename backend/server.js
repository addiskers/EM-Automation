require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csrf = require("csurf");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Routes
const formRoutes = require("./src/routes/formRoutes");
const freshworksRoutes = require("./src/routes/freshworksRoutes");

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  exposedHeaders: ["X-CSRF-Token"]
};

app.use(cors(corsOptions));

// Express Session
app.use(
  session({
    secret: process.env.SECRET_KEY || "fallback-secret-key-for-development", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// CSRF Protection
const csrfProtection = csrf({ 
  cookie: { 
    key: '_csrf',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production"
  }
});

app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false, 
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ csrfToken: token });
});

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF token validation failed:', req.headers);
    return res.status(403).json({
      message: 'Invalid CSRF token. Please refresh the page and try again.'
    });
  }
  next(err);
});

// Routes
app.use("/api/form", formRoutes);
app.use("/api/freshworks", freshworksRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));