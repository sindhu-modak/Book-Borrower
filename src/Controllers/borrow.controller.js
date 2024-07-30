import UserBookBorrow from "../Models/UserBookBorrow.js";
import { sequelize } from "../db.js";
import AvailableBooks from "../Models/AvailableBooks.js";
import User from "../Models/User.js";
import { QueryTypes } from "sequelize";

export const BorrowBook = async (req, res) => {
  try {
    // Validate user_id and book_id are positive integers
    const user_id = parseInt(req.body.user_id);
    const book_id = parseInt(req.body.book_id);
  
    const validUser = await User.findByPk(user_id);
    if (!validUser) {
      return res.status(400).json({ error: "Invalid user ID." });
    }
  
    // Check if the user already has an active borrowing record for this book
    const existingRecord = await UserBookBorrow.findOne({
      where: { user_id: user_id, book_id: book_id, toDate: null },
    });
    if (existingRecord) {
      return res
        .status(400)
        .json({ error: "User has already borrowed this book." });
    }
  
    // Check if the user is borrowing more than 2 books
    const borrowedBooks = await UserBookBorrow.count({
      where: { user_id: user_id, toDate: null },
    });
    if (borrowedBooks >= 4) {
      return res
        .status(400)
        .json({ error: "User cannot borrow more than 4 books at a time." });
    }
  
    // Check if the book is available
    const availableBook = await AvailableBooks.findOne({
      where: { book_id: book_id },
    });
    if (!availableBook || availableBook.available_count <= 0) {
      return res.status(400).json({ error: "Book is not available." });
    }
  
    // Create a new borrowing record
    await UserBookBorrow.create({ user_id: user_id, book_id: book_id });
  
    // Decrease the book count
    const result = await AvailableBooks.update(
      { available_count: availableBook.available_count - 1 },
      { where: { book_id: book_id } }
    );
    res.status(200).json({ message: "Book borrowed successfully." });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error borrowing the book." });
  }
  
};

export const BorrowedInfo = async (req, res) => {
  try {
    // Validate user_id is positive integer
    const user_id = parseInt(req.body.user_id);
  
    try {
      const results = await sequelize.query(
        `
          WITH borrow_details AS (
              SELECT
                  b.id AS "book_id",
                  b.name AS "book_name",
                  b.borrow_price AS "price",
                  COALESCE("ub"."toDate", NOW()) - "ub"."fromDate" AS "duration",
                  CASE
                      WHEN "ub"."toDate" IS null THEN 'Not Returned'
                      ELSE 'Returned'
                  END AS "return_status"
              FROM
                  "user_book_borrow" "ub"
                  JOIN "books" b ON "ub"."book_id" = b.id
              WHERE
                  "ub"."user_id" = :user_id
          ),
          aggregates AS (
              SELECT
                  SUM("price") AS "total_borrow_price",
                  COUNT(*) AS "count"
              FROM
                  borrow_details
          )
          SELECT
              bd."book_name",
              bd."duration",
              bd."return_status",
              agg."total_borrow_price",
              agg."count"
          FROM
              borrow_details bd,
              aggregates agg;
  
        `,
        {
          replacements: { user_id },
          type: QueryTypes.SELECT,
        }
      );
  
      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No borrowing records found for this user." });
      }
  
      const totalBooks = results[0].count;
      const totalCost = results[0].total_borrow_price;
      const returnedBooks = results
        .filter((record) => record.return_status === "Returned")
        .map((val) => {
          return { book_name: val.book_name, duration: val.duration };
        });
      const notReturnedBooks = results
        .filter((record) => record.return_status !== "Returned")
        .map((val) => {
          return { book_name: val.book_name, duration: val.duration };
        });
      res.status(200).json({
        totalBooks,
        totalCost,
        borrowedBooks: notReturnedBooks,
        returnedBooks: returnedBooks,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Internal server error." });
    }
  } catch (e) {
   console.error(e);
   res.status(500).json({ error: "Error while fetching the info." });
  }
};
