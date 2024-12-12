import { InferSchemaType, model, Schema } from "mongoose";

const peopleSchema = new Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: String },
    identityNumber: { type: Number },
    currentRoom: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
  },
  { timestamps: true }
);

//InferSchemaType help TypeScript indicate or understand the type of an Object base on Mongoose's Schema
//In other word: create a type for TypeScript to understand
export type People = InferSchemaType<typeof peopleSchema>;

export default model<People>("People", peopleSchema);
