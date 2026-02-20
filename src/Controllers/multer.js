const multer = require("multer");

const storage = multer.memoryStorage(); // store file in memory

const upload = multer({
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
});

module.exports = upload;