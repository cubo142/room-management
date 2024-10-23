import { InferSchemaType, model, Schema } from "mongoose";

// This object will get generated automatically every dueTime date
// User need to edit this manually
const payCheckSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    electricUsage: { type: Number }, //manually - electricUsage: use this field to calculate accumulated electricPrice | tính dựa trên lượng điện tiêu thụ tháng này (điện tiêu thụ = số điện tháng này - tháng trước) ghi trên máy điện mỗi phòng
    waterUsage: { type: Number }, //manually
    isOverdue: { type: Boolean, default: false }, //auto - based on paymentDate. false: pay in duetime || true: haven't pay in due time
    amountPaid: { type: Number }, //manually - actual amount the rentor paid that month, could possibly pay for any others month
    finalCharge: { type: Number }, //auto - finalCharge = (electricUsage * electricPrice) + (waterUsage * waterPrice) + rentPrice
    paymentDate: { type: Date }, //manually - rentor might be overdue and paid other times (could leave empty)
    isPay: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//InferSchemaType help TypeScript indicate or understand the type of an Object base on Mongoose's Schema
//In other word: create a type for TypeScript to understand
type PayCheck = InferSchemaType<typeof payCheckSchema>;

export default model<PayCheck>("PayCheck", payCheckSchema);

//Issue:
//Rentor might not be able to paid in correct date => paymentDate could have different date other than correct date within that month
//paymentDate could be leave empty
