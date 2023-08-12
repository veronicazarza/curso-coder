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
  },
});
export const UserModel = model('users', schema);