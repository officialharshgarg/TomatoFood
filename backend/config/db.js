import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://iharshgarg:hgip0525@cluster0.m1chl.mongodb.net/tomato"
    )
    .then(() => {
      console.log("DB Connected");
    });
};
