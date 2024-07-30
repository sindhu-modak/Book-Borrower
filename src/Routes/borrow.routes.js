import { Router } from "express";
import { BorrowBook,BorrowedInfo } from "../Controllers/borrow.controller.js";

const borrowRouter = Router();

borrowRouter.post("/", BorrowBook);
borrowRouter.get("/info", BorrowedInfo);
export default borrowRouter;