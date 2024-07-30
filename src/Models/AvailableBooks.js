import { sequelize } from "../db.js";
import Book from "./Book.js";
import { DataTypes } from "sequelize";

const AvailableBooks = sequelize.define('AvailableBooks', {
    book_id: { 
        type: DataTypes.BIGINT, 
        primaryKey: true, 
        references: { 
            model: 'books',
            key: 'id' 
        } 
    },
    available_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    tableName: 'available_books',
    timestamps: false
});

Book.hasOne(AvailableBooks,{
    foreignKey: 'book_id'
})

AvailableBooks.belongsTo(Book,{
    foreignKey: 'book_id'
})

export default AvailableBooks;
