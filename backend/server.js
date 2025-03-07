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

// CORS Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Express Session
app.use(
  session({
    secret: process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
      sameSite: "strict",
    },
  })
);


// CSRF Protection
const csrfMiddleware = csrf({ cookie: true });
app.use(csrfMiddleware);
app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });
  
// Routes
app.use("/api/form", formRoutes);
app.use("/api/freshworks", freshworksRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
