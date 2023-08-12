import { connect } from "mongoose";
import config from "./config.js";
export async function connectMongo() {
  try {
    await connect(
      config.mongoUrl
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}