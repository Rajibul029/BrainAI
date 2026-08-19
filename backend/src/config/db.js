
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,{dbName: "brainai"}
    );

    console.log(
      `MongoDB Connected: ${conn.connection.name}`
    );
   // const collectionNames = await mongoose.connection.db.listCollections().toArray();
    // const collectionNamesArray = collectionNames.map((collection) => collection.name);
    // console.log("Collections in the database:", collectionNamesArray);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;