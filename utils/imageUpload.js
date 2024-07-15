const multer = require("multer");
const AppError = require("./appError");

// FIXME I Have A problem while validating inputs the photo is saved on the server
exports.uploadPhoto = function (category,req) {
    const multerStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        req.category = category;
        cb(null, `uploads/${category}`);
      },
      filename: (req, file, cb) => {
        console.log(file);
        const ext = file.mimetype.split("/")[1];
        cb(null, `${category}-${Date.now()}.${ext}`);
      },
    });
    const fileFilter = (req, file, cb) => {
      if (file.mimetype.startsWith("image")) {
        cb(null, true);
      } else {
        cb(new AppError("This Is Not An Image", 403), false);
      }
    };
    const upload = multer({
      storage: multerStorage,
      fileFilter: fileFilter,
    });

    return upload.single("photo");
};
