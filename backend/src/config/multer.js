
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (
    req,
    file,
    cb
  ) {
    const category =
      req.body.category;

    cb(
      null,
      `src/uploads/${category}`
    );
  },

  filename: function (
    req,
    file,
    cb
  ) {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

export default upload;