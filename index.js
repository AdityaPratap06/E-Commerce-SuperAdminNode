const { Server } = require("socket.io");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors")
const dot = require("dotenv")
const http = require('http');
const allowedOrigin = "http://localhost:3000";

const app = express();
const port = 3006;
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

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

// Use Routers
app.use('/admin', adminRoutes);

io.on('connection', (socket) => {
    console.log('a user connected 1', socket.id);
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
