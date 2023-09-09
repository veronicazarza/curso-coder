//@ts-check
import { Schema, model } from "mongoose";

const schema = new Schema({
    products: { type: Array, required: true },
});

export const CartModel = model('carts', schema);