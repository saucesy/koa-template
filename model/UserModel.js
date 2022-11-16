import App from "../core/app/App.js";
import {DataTypes, Model} from "sequelize";

class UserModel extends Model {
}

UserModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV1,
    comment: "User table primary key"
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: "username"
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "user password"
  },
  role: DataTypes.STRING
}, {
  tableName: "users",
  sequelize: App.getConnection()
});

UserModel.sync()
  .then((model) => console.log("The user model is synchronized successfully."));

export default UserModel;
