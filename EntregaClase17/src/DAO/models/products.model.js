//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

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
schema.plugin(mongoosePaginate);
export const ProductModel = model('products', schema);