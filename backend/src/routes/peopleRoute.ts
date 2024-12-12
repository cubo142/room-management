import express from "express";
import * as NotesController from "../controllers/notes";

//Router() is a complete middleware mountable route handlers
const router = express.Router();

router.get("/", NotesController.getNotes);

router.get("/:noteId",NotesController.getNote);

router.post("/",NotesController.createNote);

router.patch("/:noteId",NotesController.updateNote);

router.delete("/:noteId",NotesController.deleteNote);

export default router;