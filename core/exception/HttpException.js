class RegisterException extends Error{
  constructor(message) {
    super();
    this.code = 10001;
    this.message = message || "注册失败";
  }
}

export default RegisterException;
