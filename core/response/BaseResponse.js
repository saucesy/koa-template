class BaseResponse {
  constructor() {
  
  }
  
  static USER_NOT_EXIST = {
    code: 10000,
    message: "The user does not exist."
  };
  static USER_ALREADY_EXISTS = {
    code: 10001,
    message: "User already exists."
  };
  
  static success(data) {
    const response = new BaseResponse();
    response.setCode(0);
    response.setMessage("OK");
    response.setData(data);
    return response;
  }
  
  setCode(code) {
    this.code = code;
  }
  
  setMessage(message) {
    this.message = message;
  }
  
  setData(data) {
    this.data = data;
  }
  
}

export default BaseResponse;
