import UserBookBorrow from "../Models/UserBookBorrow.js";
import { literal } from 'sequelize';
import Book from "../Models/Book.js";
import { sequelize } from "../db.js";

export const BorrowBook = async (req, res) => {
  // Check if user_id and book_id are provided in the request body
  if (!req.body.user_id || !req.body.book_id) {
    return res.status(400).json({ message: "Incorrect input format" });
  }
// Validate user_id and book_id are positive integers
  const user_id = parseInt(req.body.user_id);
  const book_id = parseInt(req.body.book_id);

  const record = await UserBookBorrow.findAll({
    where: {
      user_id: user_id,
      book_id: book_id,
    },
  });
  // Check if user has already borrowed the book
  if (record.length > 0) {
    res.status(200).json({ message: "User has already borrowed this book" });
  } else {
    const userCount = await UserBookBorrow.findAll({
      where: {
        user_id: user_id,
      },
    });
    if (userCount.length === 2) {
      res.json({ message: "User has already borrowed two books" });
      return;
    } else {
      const response = await UserBookBorrow.create({ user_id, book_id });
      res
        .status(200)
        .json({ message: "Book borrowed successfully", data: response });
    }
  }
};

export const BorrowedInfo = async (req, res) => {
  if (!req.body.user_id) {
    return res.status(400).json({ message: "Incorrect input format" });
  }
// Validate user_id is positive integer
  const user_id = parseInt(req.body.user_id);

  const records = await UserBookBorrow.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('book.borrow_price')), 'total_borrowed_cost'],
      [sequelize.fn('COUNT', sequelize.col('UserBookBorrow.user_id')), 'total_borrowed'],
    ],
    where: {
      user_id: user_id,
    },
    include: [{
      model: Book,
      attributes: [], // Do not include any attributes from the Book model in the result
    }],
    group: ['UserBookBorrow.user_id']
  });
  res.json(records.length > 0 ? records : {message: "User has not borrowed yet"})
}
