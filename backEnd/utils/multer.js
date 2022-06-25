const multer = require('multer');
const path = require('path');
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    //console.log(file)
    let ext = path.extname(file.originalname);
    console.log('file', ext, file);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp4') {
      return cb(new Error(`File type ${ext} not supported`), false)
      //return cb(new AppError(`File type ${ext} not supported`, 400));
    }
    cb(null, true);
  },
});
