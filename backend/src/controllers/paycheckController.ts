import { RequestHandler } from "express";
import PaycheckModel from "../models/paycheck";
import RoomModel from "../models/room";
import createHttpError from "http-errors";
import mongoose from "mongoose";

//**************Interface for Create Method**************//
interface CreatePaycheckBody {
  room?: mongoose.Types.ObjectId;
  electricUsage?: number;
  waterUsage?: number;
  finalCharge?: number;
  payList: [
    {
      paymentDate: string;
      amountPaid: number;
      note: string;
    }
  ];
}

//**************Interface for Update Method*************//
interface UpdatePaycheckParams {
  paycheckId: string;
}

interface UpdatePaycheckBody {
  electricUsage?: number;
  waterUsage?: number;
  finalCharge?: number;
  payList: [
    {
      paymentDate: string;
      amountPaid: number;
      note: string;
    }
  ];
}

//****************Get All Data****************//
export const getPaychecks: RequestHandler = async (req, res, next) => {
  try {
    const paychecks = await PaycheckModel.find().exec();

    res.status(200).json(paychecks);
  } catch (error) {
    next(error);
  }
};

//****************Ger Data by ID****************//
export const getPaycheck: RequestHandler = async (req, res, next) => {
  const paycheckId = req.params.paycheckId;

  try {
    //mongoose does not understand objectId's format that is not valid, use isValidObjectId to check if objectId is appropriate for better error message
    if (!mongoose.isValidObjectId(paycheckId)) {
      throw createHttpError(400, "Invalid paycheck ID");
    }

    const paycheck = await PaycheckModel.findById(paycheckId).exec();

    if (!paycheck) {
      throw createHttpError(404, "Paycheck not found");
    }

    res.status(200).json(paycheck);
  } catch (error) {
    next(error);
  }
};

//****************Create Data****************//
//RequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>
//Here indicate the type of ReqBody which is object CreatePaycheckBody
export const createPaycheck: RequestHandler<
  unknown,
  unknown,
  CreatePaycheckBody,
  unknown
> = async (req, res, next) => {
  const roomID = req.body.room;
  const electricUsage = req.body.electricUsage;
  const waterUsage = req.body.waterUsage;
  const finalCharge = req.body.finalCharge;
  const payList = req.body.payList;

  try {
    if (!mongoose.isValidObjectId(roomID)) {
      throw createHttpError(400, "Invalid room ID");
    }

    //Check if room exist
    const room = await RoomModel.findById(roomID);
    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    //Create I store new data
    const newPaycheck = await PaycheckModel.create({
      room: roomID,
      electricUsage: electricUsage,
      waterUsage: waterUsage,
      finalCharge: finalCharge,
      payList: payList,
    });

    //Take the paycheckID just already created & push it back to room's paycheck references (this update both room ref and paycheck ref)
    room.paycheck.push(newPaycheck._id);
    await room.save();

    res.status(201).json(newPaycheck);
  } catch (error) {
    next(error);
  }
};

//****************Update/Delete Data****************//
//PUT | PATCH method need to check params,body,req,res while GET method get params from URL. So we need to define type for params for correct paycheckId type
export const updatePaycheck: RequestHandler<
  UpdatePaycheckParams,
  unknown,
  UpdatePaycheckBody,
  unknown
> = async (req, res, next) => {
  const paycheckId = req.params.paycheckId;
  const newElectricUsage = req.body.electricUsage;
  const newWaterUsage = req.body.waterUsage;
  const newFinalCharge = req.body.finalCharge;
  const newPayList = req.body.payList;

  try {
    if (!mongoose.isValidObjectId(paycheckId)) {
      throw createHttpError(400, "Invalid paycheck ID");
    }

    const paycheck = await PaycheckModel.findById(paycheckId).exec(); //fetch the data by ID

    if (!paycheck) {
      throw createHttpError(404, "Paycheck not found");
    }

    paycheck.electricUsage = newElectricUsage;
    paycheck.waterUsage = newWaterUsage;
    paycheck.finalCharge = newFinalCharge;

    // Update or add to payList
    paycheck.set("payList", newPayList);

    const updatedPaycheck = await paycheck.save();
    //PaycheckModel.findByIdAndUpdate(paycheck): this is a viable option to save changes but it will fetch the data again

    res.status(200).json(updatedPaycheck);
  } catch (error) {
    next(error);
  }
};

//****************Delete Data****************//
export const deletePaycheck: RequestHandler = async (req, res, next) => {
  const paycheckId = req.params.paycheckId;
  try {
    if (!mongoose.isValidObjectId(paycheckId)) {
      throw createHttpError(400, "Invalid paycheck ID");
    }

    const paycheck = await PaycheckModel.findById(paycheckId).exec();

    if (!paycheck) {
      throw createHttpError(404, "Paycheck not found");
    }

    await paycheck.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
