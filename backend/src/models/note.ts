import { InferSchemaType, model, Schema } from "mongoose";

const noteSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String },
},{timestamps:true});

//InferSchemaType help TypeScript indicate or understand the type of an Object base on Mongoose's Schema
//In other word: create a type for TypeScript to understand
type Note = InferSchemaType<typeof noteSchema>; 

export default model<Note>("Note", noteSchema);