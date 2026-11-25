
require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://artcom2.vercel.app/"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

// Authentication routes
app.use("/api/auth", require("../routes/authRoutes"));

app.get("/", (req, res) => {
    res.send("Authentication API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
