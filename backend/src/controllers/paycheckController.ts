import { RequestHandler } from "express";
import PaycheckModel from "../models/paycheck";
import createHttpError from "http-errors";
import mongoose, { ObjectId } from "mongoose";

export const getPaychecks: RequestHandler = async (req, res, next) => {
  try {
    const paychecks = await PaycheckModel.find().exec();

    res.status(200).json(paychecks);
  } catch (error) {
    next(error);
  }
};

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

interface CreatePaycheckBody {
  room?: ObjectId;
  electricUsage?: number;
  waterUsage?: number;
  finalCharge?: number;
  payList: [
    {
      paymentDate: Date;
      amountPaid: number;
      note: string;
    }
  ];
}

//RequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>
//Here indicate the type of ReqBody which is object CreatePaycheckBody
export const createPaycheck: RequestHandler<
  unknown,
  unknown,
  CreatePaycheckBody,
  unknown
> = async (req, res, next) => {
  const room = req.body.room;
  const electricUsage = req.body.electricUsage;
  const waterUsage = req.body.waterUsage;
  const finalCharge = req.body.finalCharge;
  const payList = req.body.payList;

  try {
    // if (!title) {
    //   throw createHttpError(400, "Paycheck must have a title");
    // }

    //  "create()" method create and save new object to mongoDB base on provided model
    const newPaycheck = await PaycheckModel.create({
      room: room,
      electricUsage: electricUsage,
      waterUsage: waterUsage,
      finalCharge: finalCharge,
      payList: payList,
    });

    res.status(201).json(newPaycheck);
  } catch (error) {
    next(error);
  }
};

//PUT | PATCH method need to check params,body,req,res while GET method get params from URL. So we need to define type for params for correct paycheckId type
interface UpdatePaycheckParams {
  paycheckId: string;
}

interface UpdatePaycheckBody {
  electricUsage?: number;
  waterUsage?: number;
  finalCharge?: number;
  payList: [
    {
      paymentDate: Date;
      amountPaid: number;
      note: string;
    }
  ];
}

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

    // if (!newTitle) {
    //   throw createHttpError(400, "Paycheck must have a title");
    // }

    const paycheck = await PaycheckModel.findById(paycheckId).exec(); //fetch the data by ID

    if (!paycheck) {
      throw createHttpError(404, "Paycheck not found");
    }

    paycheck.electricUsage = newElectricUsage;
    paycheck.waterUsage = newWaterUsage;
    paycheck.finalCharge = newFinalCharge;

    // Update or add to payList
    paycheck.set('payList', newPayList);

    const updatedPaycheck = await paycheck.save(); //save changes
    //PaycheckModel.findByIdAndUpdate(paycheck): this is a viable option to save changes but it will fetch the data again

    res.status(200).json(updatedPaycheck);
  } catch (error) {
    next(error);
  }
};

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
