// controllers/uploadController.js

const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Check file type
const checkFileType = (file, cb) => {
  // Allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('file');

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message || err });
    }
    res.status(200).json({ success: true, url: req.file.path });
  });
};
