import { InferSchemaType, model, Schema } from "mongoose";

const roomSchema = new Schema(
  {
    roomName: { type: String, required: true },
    rentPrice: { type: Number },
    rentDate: { type: Date },
    electricPrice: { type: Number }, // rule: ?VND/1KW - ex: 3.000 VND/1KW
    waterPrice: { type: Number }, // the same as electricPrice
    dueTime: { type: Date }, //automatically change every months
    isRent: { type: Boolean, default: false },
    amountLeft: { type: Number }, //amountLeft accumulated every month that finalCharge was not payup. amoutnLeft = amountPaid(of every month)
    paymentHistory: [
      //auto generate every dueTime
      {
        type: Schema.Types.ObjectId,
        ref: "PayCheck",
      },
    ],
    peoples: [
      {
        type: Schema.Types.ObjectId,
        ref: "People",
      },
    ],
    note: { type: String },
  },
  { timestamps: true }
);

//InferSchemaType help TypeScript indicate or understand the type of an Object base on Mongoose's Schema
//In other word: create a type for TypeScript to understand
type Room = InferSchemaType<typeof roomSchema>;

export default model<Room>("Room", roomSchema);

//Consider using Prototype Pattern
//User can create many room of same type
//When the room state switched from rent(true) -> unrent(false), only clear not reusable detail (keep rent history & price detail)
//Instead of saving copy of payment history in database, give option to download a .doc or text file of payment history
