import UserBookBorrow from "../Models/UserBookBorrow.js";

export const ReturnBook = async (req, res) => {
    // Check if user_id and book_id are provided in the request body
  if (!req.body.user_id || !req.body.book_id) {
    return res.status(400).json({ message: "Incorrect input format" });
  }
  // Validate user_id and book_id are positive integers
  const user_id = parseInt(req.body.user_id);
  const book_id = parseInt(req.body.book_id);

  const result = await UserBookBorrow.destroy({
    where: {
      user_id: user_id,
      book_id: book_id,
    },
  });
  res.json({ message: "Book returned successfully" });
};
