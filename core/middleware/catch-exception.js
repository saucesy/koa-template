import HttpException from "../exception/HttpException.js";

function catchException() {
  return async (context, next) => {
    try {
      await next();
    } catch (error) {
      if (error instanceof HttpException) {
        context.body = {
          code: error.code,
          message: error.message,
          request: `${context.method} ${context.path}`
        };
      } else {
        context.body = {
          code: 50000,
          message: "服务器好像有点小问题，等我检查下~"
        };
      }
      
      if (process.env.MODE === "development") {
        console.log(error);
      }
    }
  };
}

export default catchException;
