import { booksData, usersData } from "./mockData.js";
import User from "../Models/User.js";
import Book from "../Models/Book.js";
import { sequelize } from "../db.js";
import UserBookBorrow from "../Models/UserBookBorrow.js";

await sequelize.sync({ force: true });
export default async function() {
    try{
        usersData.forEach(async(record) => {
            let user = await User.create({
                id: record.id,
                name: record.name,
                email: record.email,
                phone_number: record.phone_number
            })
            console.log(`User created with ID: ${user.id}`);
        })
        
        booksData.forEach(async(record) => {
            let book = await Book.create({
                id: record.id,
                name: record.name,
                description: record.description,
                author: record.author,
                publisher: record.publisher,
                borrow_price: record.borrow_price
            })
            console.log(`Book created with ID: ${book.id}`);
        })
        await UserBookBorrow.create({
            book_id: 2,
            user_id: 1,
        })
    } catch (err) {
        console.log(err)
    }
}