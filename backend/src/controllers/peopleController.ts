import { RequestHandler } from "express";
import PeopleModel from "../models/people";
import RoomModel from "../models/room";
import createHttpError from "http-errors";
import mongoose from "mongoose";

//**************Interface for Create Method**************//
interface CreatePeopleBody {
  name: string;
  dateOfBirth: string;
  identityNumber: string;
  currentRoom: mongoose.Types.ObjectId;
}

//**************Interface for Update Method*************//
interface UpdatePeopleParams {
  peopleId: string;
}

interface UpdatePeopleBody {
  name: string;
  dateOfBirth: string;
  identityNumber: string;
  currentRoom: mongoose.Types.ObjectId;
}

//****************Get All Data****************//
export const getPeoples: RequestHandler = async (req, res, next) => {
  try {
    const peoples = await PeopleModel.find().exec();

    res.status(200).json(peoples);
  } catch (error) {
    next(error);
  }
};

//****************Get Data by ID****************//
export const getPeople: RequestHandler = async (req, res, next) => {
  const peopleId = req.params.peopleId;

  try {
    //mongoose does not understand objectId's format that is not valid, use isValidObjectId to check if objectId is appropriate for better error message
    if (!mongoose.isValidObjectId(peopleId)) {
      throw createHttpError(400, "Invalid people ID");
    }

    const people = await PeopleModel.findById(peopleId).exec();

    if (!people) {
      throw createHttpError(404, "People not found");
    }

    res.status(200).json(people);
  } catch (error) {
    next(error);
  }
};

//****************Create Data****************//
//RequestHandler<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = Query>
//Here indicate the type of ReqBody which is object CreatePeopleBody
export const createPeople: RequestHandler<
  unknown,
  unknown,
  CreatePeopleBody,
  unknown
> = async (req, res, next) => {
  const name = req.body.name;
  const dateOfBirth = req.body.dateOfBirth;
  const identityNumber = req.body.identityNumber;
  const roomID = req.body.currentRoom;

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
    const newPeople = await PeopleModel.create({
      name: name,
      dateOfBirth: dateOfBirth,
      identityNumber: identityNumber,
      currentRoom: roomID,
    });

    //Take the peopleID just already created & push it back to room's people references (this update both room ref and people ref)
    room.people.push(newPeople._id);
    await room.save();

    res.status(201).json(newPeople);
  } catch (error) {
    next(error);
  }
};

//****************Update Data****************//
//PUT | PATCH method need to check params,body,req,res while GET method get params from URL. So we need to define type for params for correct peopleId type
export const updatePeople: RequestHandler<
  UpdatePeopleParams,
  unknown,
  UpdatePeopleBody,
  unknown
> = async (req, res, next) => {
  const peopleId = req.params.peopleId;
  const newName = req.body.name;
  const newDateOfBirth = req.body.dateOfBirth;
  const newIdentityNumber = req.body.identityNumber;
  const newRoomID = req.body.currentRoom;

  try {
    const newRoom = await RoomModel.findById(newRoomID);
    const people = await PeopleModel.findById(peopleId).exec(); //fetch the data by ID
    //Validate peopleID
    if (!mongoose.isValidObjectId(peopleId)) {
      throw createHttpError(400, "Invalid people ID");
    }

    //Validate roomID
    if (!mongoose.isValidObjectId(newRoomID)) {
      throw createHttpError(400, "Invalid room ID");
    }

    //Check room exist
    if (!newRoom) {
      throw createHttpError(404, "Room not found");
    }

    //Check people exist
    if (!people) {
      throw createHttpError(404, "People not found");
    }

    //Take old roomID
    const oldRoomId = people?.currentRoom;

    //Update new data
    people.name = newName;
    people.dateOfBirth = newDateOfBirth;
    people.identityNumber = newIdentityNumber;
    people.currentRoom = newRoomID;

    const updatedPeople = await people.save(); //save updated People

    //Get oldRoom data
    const oldRoom = await RoomModel.findById(oldRoomId);

    //Remove old peopleID from RoomModel if user change room
    if (!oldRoom) {
      throw createHttpError(404, `Room with ID:${oldRoomId} not found`);
    }

    // Delete people from oldroom if they change room
    oldRoom.people = oldRoom.people.filter((p) => !p.equals(peopleId));
    await oldRoom.save(); //save changes

    // Add people to new room
    newRoom.people.push(new mongoose.Types.ObjectId(peopleId));
    await newRoom.save();

    //PeopleModel.findByIdAndUpdate(people): this is a viable option to save changes but it will fetch the data again
    res.status(200).json(updatedPeople);
  } catch (error) {
    next(error);
  }
};

//****************Delete Data****************//
export const deletePeople: RequestHandler = async (req, res, next) => {
  const peopleId = req.params.peopleId;
  try {
    if (!mongoose.isValidObjectId(peopleId)) {
      throw createHttpError(400, "Invalid people ID");
    }

    const people = await PeopleModel.findById(peopleId).exec();

    if (!people) {
      throw createHttpError(404, "People not found");
    }

    await people.deleteOne();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
