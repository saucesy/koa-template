import UserModel from "../model/UserModel.js";
import BaseResponse from "../core/response/BaseResponse.js";
import HttpException from "../core/exception/HttpException.js";

class UserService {
  /**
   * @param {User} user
   */
  static async register(user) {
    const username = user.getUsername();
    const password = user.getPassword();
    
    const userModel = await UserModel.findOne({where: {username}});
    if(userModel instanceof UserModel) {
      throw new HttpException(BaseResponse.USER_ALREADY_EXISTS);
    }
    return UserModel.create({username, password});
  }
  
}

export default UserService;
