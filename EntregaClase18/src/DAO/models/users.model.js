//@ts-check
import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: {
    type: String,
    max: 100,
  },
  lastName: {
    type: String,
    max: 100,
  },
  password: {
    type: String,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  admin: {
    type: Boolean,
  },
  age: {
    type: Number,
    required: false, 
    max: 100 
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
    required: false,
    max: 100,
  },
});
export const UserModel = model('users', schema);