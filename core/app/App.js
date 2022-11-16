/**
 * built-in module
 */
import fs from "fs";
import url from "url";
import path from "path";
/**
 * external module
 */
import Koa from "koa";
import dotenv from "dotenv";
import Router from "koa-router";
import {koaBody} from "koa-body";
import koaHelmet from "koa-helmet";
import {Sequelize} from "sequelize";
/**
 * internal module
 */
import catchException from "../middleware/catch-exception.js";

class App {
  static routers = [];
  static sequelize = null;
  static baseRouter = new Router({prefix: "/v1"});
  
  /**
   * Application launch entry
   * @param context
   * @return {Promise<Koa>}
   */
  static launch(context) {
    return new Promise(async (resolve, reject) => {
      try {
        App.initConfig();
        App.initConnection();
        await App.initRouter();
        App.initMiddleware(context);
        resolve(context);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * initialize configuration
   * @private
   */
  static initConfig() {
    // 加载根目录下的.env文件，自动注册到process.env中
    dotenv.config();
    // 为全局属性定义 dir 方法，解决在ESModule下__dirname失效的问题
    Object.defineProperty(
      global,
      "dir",
      {
        get() {
          return (importMetaUrl, filetype = false) => {
            let dir = path.dirname(importMetaUrl);
            return filetype ? dir : url.fileURLToPath(dir);
          };
        }
      }
    );
  }
  
  /**
   * initialize router controller
   * @private
   */
  static async initRouter() {
    const routerRoot = path.resolve(process.cwd(), "controller");
    const routerRootFile = url.pathToFileURL(routerRoot).href;
    
    const files = fs.readdirSync(routerRoot);
    for (const file of files) {
      // instantiate router object
      const router = new Router();
      // import routing controller
      const Controller = (await import(routerRootFile + "/" + file)).default;
      // prefix the routing controller
      router.prefix(Controller.prefix || "");
      // instantiate routing controller
      const controller = new Controller();
      Object.keys(controller).forEach((key) => {
        // path of request
        const path = key;
        // method of request
        const method = controller[key].toLowerCase();
        // Call the router object and use the corresponding method on
        // the Controller constructor prototype as the callback function for the router object
        router[method]("/" + path, Controller.prototype[key]);
      });
      App.routers.push(router);
    }
    
    App.routers.forEach((router) => App.baseRouter.use(router.routes()));
  }
  
  /**
   * initialize middleware
   * @param context
   * @private
   */
  static initMiddleware(context) {
    // Parse the request body
    context.use(koaBody());
    // Safety response header
    context.use(koaHelmet());
    // Global exception catch
    context.use(catchException());
    // Routing controller
    context.use(App.baseRouter.routes());
  }
  
  /**
   * initialize database connection
   * @return {null}
   */
  static initConnection() {
    App.sequelize = new Sequelize(
      process.env.DATABASE_NAME,
      process.env.DATABASE_USERNAME,
      process.env.DATABASE_PASSWORD,
      {
        logging: false,
        host: process.env.HOST,
        dialect: process.env.DATABASE
      }
    );
  }
  
  /**
   * get database connection
   * @return {Sequelize}
   */
  static getConnection() {
    return App.sequelize;
  }
}

export default App;
