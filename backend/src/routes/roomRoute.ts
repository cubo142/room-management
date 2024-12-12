import express from "express";
import * as RoomController from "../controllers/roomController";

//Router() is a complete middleware mountable route handlers
const router = express.Router();

router.get("/", RoomController.getRooms);

router.get("/:roomId",RoomController.getRoom);

router.post("/",RoomController.createRoom);

router.patch("/:roomId",RoomController.updateRoom);

router.delete("/:roomId",RoomController.deleteRoom);

export default router;