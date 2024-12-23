import { InferSchemaType, model, Schema } from "mongoose";

// This object will get generated automatically every dueTime date (of last month)
// User need to edit this manually
const payCheckSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    electricUsage: { type: Number }, //manually - electricUsage: use this field to calculate accumulated electricPrice | tính dựa trên lượng điện tiêu thụ tháng này (điện tiêu thụ = số điện tháng này - tháng trước) ghi trên máy điện mỗi phòng
    waterUsage: { type: Number }, //manually - like electricUsage
    finalCharge: { type: Number }, //auto - finalCharge = (electricUsage * electricPrice) + (waterUsage * waterPrice) + rentPrice
    payList: [
      //manually - added because rentor could pay manytimes within a month
      {
        paymentDate: { type: String }, //manually
        amountPaid: { type: Number }, //manually - actual amount the rentor paid for that month, could possibly pay for any others month
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

//InferSchemaType help TypeScript indicate or understand the type of an Object base on Mongoose's Schema
//In other word: create a type for TypeScript to understand
export type PayCheck = InferSchemaType<typeof payCheckSchema>;

export default model<PayCheck>("PayCheck", payCheckSchema);

//Issue:
//****Rentor might not be able to paid in that month
//payList could possibly be empty that month => amountPaid = 0

//****There could be rentor pay for extra month so user might want to manually write it in the note for reminding.
//Ex: month 1 = 5000k, rentor pay = 10000k (for last month and this month)
// => month 1 amountLeft = finalCharge - amountPaid <=> amountLeft = 5000k - 10000k = -5000 vnd
// => month 2 amountLeft = finalCharge - amountPaid <=> amountLeft = 5000k - -5000k =  0    vnd
