import { connect } from "mongoose";
export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://veronicastefaniazarza:Veronz1992@codecluster.qtao5ew.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}