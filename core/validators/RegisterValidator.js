import {KeValidator, Rule} from "ke-validator";

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
    
    this.repassword = function (row) {
      if (row.repassword !== row.password) {
        throw new Error("两次密码输入不一致，请重新输入");
      }
    };
  }
}


export default RegisterValidator;
