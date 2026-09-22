const multer = require("multer");
const path = require("path");

const uploadPath = path.join(__dirname, "../../uploads");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const name =
            Date.now() + "-" + file.originalname;

        cb(null, name);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;