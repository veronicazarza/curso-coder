//@ts-check
import { Schema, model } from "mongoose";

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    thumbnail: { type: String, required: false },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: {type: Boolean, required: true }
});

export const ProductModel = model('products', schema);