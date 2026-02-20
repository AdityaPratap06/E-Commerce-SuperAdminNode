const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
const dot = require("dotenv")
const http = require('http');
const allowedOrigin = ["http://localhost:5173", "http://localhost:3000"];
const path = require("path");
const app = express();
const port = 3006;
const server = http.createServer(app)
const fs = require("fs");
app.use(cors({
    origin: "*",   // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

dot.config().parsed;
const db_link = process.env.db_link
console.log(db_link);

mongoose.connect(db_link)
    .then(() => console.log("Connected to Main DB"))
    .catch(err => console.log(err));

app.use(express.json());
// app.use(cors({ 'origin': '*' }));
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbLink = process.env.db_link;
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Routers
const adminRoutes = require("./src/Routes/adminRoutes");
const categoryRoutes = require("./src/Routes/categoryRoutes");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Static folder path:", path.resolve(__dirname, "uploads"));

console.log("Uploads exists:", fs.existsSync("uploads"));
// Use Routers
app.use('/admin', adminRoutes);
app.use("/categories", categoryRoutes);

// app.get("/uploads", (req, res) => {
//     fs.readdir(path.join(__dirname, "uploads"), (err, files) => {
//         if (err) return res.status(500).send(err);
//         res.json(files);
//     });
// });
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
