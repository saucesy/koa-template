import Koa from "koa";
import App from "../core/app/App.js";

App.launch(new Koa()).then((context) => {
  context.listen(process.env.PORT);
}).catch((reason) => {
  console.log(reason);
});
