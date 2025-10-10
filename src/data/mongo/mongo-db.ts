import mongoose from "mongoose";

export interface MongoParams {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: MongoParams) {
    const { mongoUrl, dbName } = options;

    try {
      await mongoose.connect(mongoUrl, {
        dbName,
      });

      return true;
    } catch (error) {
      console.log("Mongo connection error");
      throw error;
    }
  }
}
