import { Router } from "express";
import { ReturnBook } from "../Controllers/returnBook.controller.js";
import { returnBookSchema, validateRequest } from '../Middlewares/validation.js';

const returnRouter = Router();

returnRouter.post("/", validateRequest(returnBookSchema), ReturnBook);

export default returnRouter;