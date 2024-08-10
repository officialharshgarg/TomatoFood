import express from "express";
import { addFood } from "../controllers/foodController.js";
import multer from "multer"; //its used for image storage system

const foodRouter = express.Router();

//Image Storage Engine
//it will store images in upload folder
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);

export default foodRouter;
