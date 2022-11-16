import User from "../pojo/User.js";
import UserService from "../service/UserService.js";
import BaseResponse from "../core/response/BaseResponse.js";
import RegisterValidator from "../core/validators/RegisterValidator.js";

class UserController {
  static prefix = "/user";
  
  constructor() {
    this.register = "post";
  }
  
  async register(context) {
    const v = new RegisterValidator().validate(context);
    const user = new User();
    user.setUsername(v.get("username"));
    user.setPassword(v.get("password"));
    try {
      await UserService.register(user);
      context.body = BaseResponse.success();
    } catch (error) {
      throw error;
    }
  }
}

export default UserController;
