import express from "express";
import * as PeopleController from "../controllers/peopleController";

//Router() is a complete middleware mountable route handlers
const router = express.Router();

router.get("/", PeopleController.getPeoples);

router.get("/:peopleId",PeopleController.getPeople);

router.post("/",PeopleController.createPeople);

router.patch("/:peopleId",PeopleController.updatePeople);

router.delete("/:peopleId",PeopleController.deletePeople);

export default router;