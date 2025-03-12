const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// here w configure the storage of uploaded doc image with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

//filter
const fileFilter = (req, file, cb) => {
  // check that it's an image
  if (file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new Error('The uploaded file must be a .jpg'), false);
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});