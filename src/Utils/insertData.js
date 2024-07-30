import { booksData, usersData, availableBooksData } from "./mockData.js";
import User from "../Models/User.js";
import Book from "../Models/Book.js";
import { sequelize } from "../db.js";
import UserBookBorrow from "../Models/UserBookBorrow.js";
import AvailableBooks from "../Models/AvailableBooks.js";

// await sequelize.sync({ force: true });
export default async function() {
    try{
        await User.bulkCreate(usersData)        
        await Book.bulkCreate(booksData)
        await AvailableBooks.bulkCreate(availableBooksData) 
        await UserBookBorrow.create({
            book_id: 2,
            user_id: 1,
        })
    } catch (err) {
        console.log(err)
    }
}