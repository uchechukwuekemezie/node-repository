const express = require("express");
const connectDB = require("./config/db");
const expressSession = require("express-session");

// to connect to the database
connectDB();

const app = express();
app.use(express.json()); // this middleware will parse the incoming request body in json format

// to manage user sessions
app.use(
  expressSession({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true in production with HTTPS
  }),
);

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
