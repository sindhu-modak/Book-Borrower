import { Router } from "express";
import { ReturnBook } from "../Controllers/returnBook.controller.js";

const returnRouter = Router();

returnRouter.post("/", ReturnBook);

export default returnRouter;