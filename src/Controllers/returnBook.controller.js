import UserBookBorrow from "../Models/UserBookBorrow.js";
import AvailableBooks from "../Models/AvailableBooks.js";
import User from "../Models/User.js";

export const ReturnBook = async (req, res) => {
  // Check if user_id and book_id are provided in the request body
  if (!req.body.user_id || !req.body.book_id) {
    return res.status(400).json({ message: "Incorrect input format" });
  }

  // Validate user_id and book_id are positive integers
  const user_id = parseInt(req.body.user_id);
  const book_id = parseInt(req.body.book_id);

  //Check if user is valid
  const validUser = await User.findByPk(user_id);
  if (!validUser) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  // Check if the user has borrowed the book
  const borrowingRecord = await UserBookBorrow.findOne({
    where: {
      user_id: user_id,
      book_id: book_id,
      toDate: null, 
    },
  });
  if (!borrowingRecord) {
    return res
      .status(404)
      .json({ error: "No active borrowing record found for this book." });
  }

  // Return the book
  await UserBookBorrow.update(
    { toDate: new Date() }, // Set to current date/time
    { where: { user_id: user_id, book_id: book_id, toDate: null } }
  );

  // Update the available books count
  const availableBook = await AvailableBooks.findOne({
    where: { book_id: book_id },
  });

  if (!availableBook) {
    return res
      .status(404)
      .json({ error: "Book not found in the available books list." });
  }

  // Increment the count of available books
  await AvailableBooks.update(
    { available_count: availableBook.available_count + 1 },
    { where: { book_id: book_id } }
  );

  res.status(200).json({ message: "Book returned successfully." });
};
