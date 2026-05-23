import multer from "multer";

//======================================================
// MULTER STORAGE
//======================================================

const storage = multer.diskStorage({});

//======================================================
// FILE FILTER
//======================================================

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

//======================================================
// UPLOAD
//======================================================

const upload = multer({
  storage,

  fileFilter,
});

export default upload;
