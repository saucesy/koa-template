/**
 * built-in module
 */
import fs from "fs";
import url from "url";
import path from "path";
/**
 * external module
 */
import dotenv from "dotenv";
import Router from "koa-router";
import {koaBody} from "koa-body";
import koaHelmet from "koa-helmet";
import {Sequelize} from "sequelize";
/**
 * internal module
 */
import catchException from "../core/middleware/catch-exception.js";

class App {
  static routers = [];
  static sequelize = null;
  static baseRouter = new Router({prefix: "/v1"});
  
  /**
   * 应用启动入口
   * @param context
   * @return {Promise<void>}
   */
  static async launch(context) {
    App.initConfig();
    await App.initRouter();
    App.initMiddleware(context);
  }
  
  /**
   * 初始化配置
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
   * 初始化路由
   * @private
   */
  static async initRouter() {
    const routerRoot = path.resolve(global.dir(import.meta.url), "../controller");
    const routerRootFile = url.pathToFileURL(routerRoot).href;
    
    const files = fs.readdirSync(routerRoot);
    for (const file of files) {
      // 实例化一个router对象
      const router = new Router();
      // 导入控制器
      const Controller = (await import(routerRootFile + "/" + file)).default;
      // 为路由添加前缀
      router.prefix(Controller.prefix || "");
      // 实例化控制器
      const controller = new Controller();
      Object.keys(controller).forEach((key) => {
        // 请求路径
        const path = key;
        // 请求方法
        const method = controller[key].toLowerCase();
        // 调用router对象，将Controller构造函数原型上对应的方法作为该router对象的回调函数
        router[method]("/" + path, Controller.prototype[key]);
      });
      App.routers.push(router);
    }
    
    App.routers.forEach((router) => App.baseRouter.use(router.routes()));
  }
  
  /**
   * 初始化中间件
   * @param context
   * @private
   */
  static initMiddleware(context) {
    // 解析请求体
    context.use(koaBody());
    // 安全响应头
    context.use(koaHelmet());
    // 全局异常捕获
    context.use(catchException());
    // 路由
    context.use(App.baseRouter.routes());
  }
  
  /**
   * 初始化 Sequelize
   * @return {null}
   */
  static initSequelize() {
    if (!App.sequelize) {
      App.sequelize = new Sequelize(
        process.env.DATABASE,
        process.env.DATABASE_USERNAME,
        process.env.DATABASE_PASSWORD,
        {
          logging: false,
          dialect: "mysql",
          host: process.env.HOST,
        }
      );
    }
    return App.sequelize;
  }
}

export default App;
