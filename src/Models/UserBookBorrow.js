// models/UserBookBorrow.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Book from "./Book.js";
import User from "./User.js";

const UserBookBorrow = sequelize.define(
  "UserBookBorrow",
  {
    book_id: {
      type: DataTypes.BIGINT,
      references: {
        model: Book,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.BIGINT,
      references: {
        model: User,
        key: "id",
      },
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("'infinity'"),
    },
  },
  {
    tableName: "user_book_borrow",
    timestamps: false,
  }
);

Book.hasMany(UserBookBorrow, { foreignKey: 'book_id' });
UserBookBorrow.belongsTo(Book, { foreignKey: 'book_id' });

User.hasMany(UserBookBorrow, { foreignKey: 'user_id' });
UserBookBorrow.belongsTo(User, { foreignKey: 'user_id' });

export default UserBookBorrow;
