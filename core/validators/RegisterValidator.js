import {KeValidator, Rule} from "ke-validator/es/index.js";

class RegisterValidator extends KeValidator {
  constructor() {
    super();
    this.username = [
      new Rule({
        name: "isLength",
        message: "用户名长度需要在4~12之间",
        options: {min: 4, max: 12}
      })
    ];
    
    this.password = [
      new Rule({
        name: "isLength",
        message: "密码长度需要在6~24之间",
        options: {min: 6, max: 24}
      })
    ];
  }
}


export default RegisterValidator;
