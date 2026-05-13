const express = require("express");
const connectDB = require("./config/db");

// to connect to the database
connectDB();

const app = express();
app.use(express.json()); // this middleware will parse the incoming request body in json format

const PORT = 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
