import { RequestHandler } from "express";
import RoomModel from "../models/room";
import createHttpError from "http-errors";
import mongoose, { ObjectId } from "mongoose";

export const getRooms: RequestHandler = async (req, res, next) => {
  try {
    const rooms = await RoomModel.find().exec();

    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoom: RequestHandler = async (req, res, next) => {
  const roomId = req.params.roomId;

  try {
    //mongoose does not understand objectId's format that is not valid, use isValidObjectId to check if objectId is appropriate for better error message
    if (!mongoose.isValidObjectId(roomId)) {
      throw createHttpError(400, "Invalid room ID");
    }

    const room = await RoomModel.findById(roomId)
      .populate("paycheck")
      // .populate("people")
      .exec();

    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

interface CreateRoomBody {
  roomName: string;
  rentPrice: number;
  rentDate: Date;
  electricPrice: number;
  waterPrice: number;
  dueTime: Date;
  isRent: boolean;
  amountLeft: number;
  paycheck: string[];
  people: string[];
  note: string;
}

//RequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>
//Here indicate the type of ReqBody which is object CreateRoomBody
export const createRoom: RequestHandler<
  unknown,
  unknown,
  CreateRoomBody,
  unknown
> = async (req, res, next) => {
  const roomName = req.body.roomName;
  const rentPrice = req.body.rentPrice;
  const rentDate = req.body.rentDate;
  const electricPrice = req.body.electricPrice;
  const waterPrice = req.body.waterPrice;
  const dueTime = req.body.dueTime;
  const isRent = req.body.isRent;
  const amountLeft = req.body.amountLeft;
  const paycheck = req.body.paycheck;
  const people = req.body.people;
  const note = req.body.note;

  try {
    if (!roomName) {
      throw createHttpError(400, "Room must have a title name");
    }

    //  "create()" method create and save new object to mongoDB base on provided model
    const newRoom = await RoomModel.create({
      roomName: roomName,
      rentPrice: rentPrice,
      rentDate: rentDate,
      electricPrice: electricPrice,
      waterPrice: waterPrice,
      dueTime: dueTime,
      isRent: isRent,
      amountLeft: amountLeft,
      paycheck: paycheck,
      people: people,
      note: note,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
};

//PUT | PATCH method need to check params,body,req,res while GET method get params from URL. So we need to define type for params for correct roomId type
interface UpdateRoomParams {
  roomId: string;
}

interface UpdateRoomBody {
  roomName?: string;
  rentPrice?: number;
  rentDate?: Date;
  electricPrice?: number;
  waterPrice?: number;
  dueTime?: Date;
  isRent: boolean;
  amountLeft?: number;
  note?: string;
  paycheck:[ObjectId];
}

export const updateRoom: RequestHandler<
  UpdateRoomParams,
  unknown,
  UpdateRoomBody,
  unknown
> = async (req, res, next) => {
  const roomId = req.params.roomId;
  const newRoomName = req.body.roomName;
  const newRentPrice = req.body.rentPrice;
  const newRentDate = req.body.rentDate;
  const newElectricPrice = req.body.electricPrice;
  const newWaterPrice = req.body.waterPrice;
  const newDueTime = req.body.dueTime;
  const newIsRent = req.body.isRent;
  const newAmountLeft = req.body.amountLeft;
  const newNote = req.body.note;
  const newPaycheck = req.body.paycheck;

  try {
    if (!mongoose.isValidObjectId(roomId)) {
      throw createHttpError(400, "Invalid room ID");
    }

    if (!newRoomName) {
      throw createHttpError(400, "Room must have a name");
    }

    const room = await RoomModel.findById(roomId).exec(); //fetch the data by ID

    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    room.roomName = newRoomName;
    room.rentPrice = newRentPrice;
    room.rentDate = newRentDate;
    room.electricPrice = newElectricPrice;
    room.waterPrice = newWaterPrice;
    room.dueTime = newDueTime;
    room.isRent = newIsRent;
    room.amountLeft = newAmountLeft;
    room.note = newNote;

    //update paycheck
    room.set('paycheck',newPaycheck);

    const updatedRoom = await room.save(); //save changes
    //RoomModel.findByIdAndUpdate(room): this is a viable option to save changes but it will fetch the data again

    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const deleteRoom: RequestHandler = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    if (!mongoose.isValidObjectId(roomId)) {
      throw createHttpError(400, "Invalid room ID");
    }

    const room = await RoomModel.findById(roomId).exec();

    if (!room) {
      throw createHttpError(404, "Room not found");
    }

    await room.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
