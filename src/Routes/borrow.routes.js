import { Router } from "express";
import { BorrowBook,BorrowedInfo } from "../Controllers/borrow.controller.js";
import { borrowBookSchema, borrowInfoSchema, validateRequest } from '../Middlewares/validation.js';

const borrowRouter = Router();

borrowRouter.post("/",validateRequest(borrowBookSchema), BorrowBook);
borrowRouter.get("/info", validateRequest(borrowInfoSchema), BorrowedInfo);
export default borrowRouter;