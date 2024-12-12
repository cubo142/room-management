import express from "express";
import * as PaychecksController from "../controllers/paycheckController";

//Router() is a complete middleware mountable route handlers
const router = express.Router();

router.get("/", PaychecksController.getPaychecks);

router.get("/:paycheckId",PaychecksController.getPaycheck);

router.post("/",PaychecksController.createPaycheck);

router.patch("/:paycheckId",PaychecksController.updatePaycheck);

router.delete("/:paycheckId",PaychecksController.deletePaycheck);

export default router;