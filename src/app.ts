import config from "config";
import cors from "cors";
import express from "express";
import IController from "./common/controller-interface";
import errorHandler from "./error/error-handler";

class App {
    public app: express.Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandler();
    }
    // This function is use create port where our app is running.
    public listen(): void {
        this.app.listen(5000, () => {
            console.log("App is running  on 5000");
        });
    }

    public getServer(): express.Application {
        return this.app;
    }
    //initializeMiddlewares
    // It is used to setup cross origin options in our app.
    private initializeMiddlewares() {
        const corsOptions = {
            origin: config.get<string>("cors.origin")
        };
        // Middleware for CORS
        this.app.use(cors(corsOptions));

        // Middlewares for bodyparsing using both json and urlencoding
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
    }
    //initializeMiddlewares
    // It is used to intialize controller for routing.
    private initializeControllers(controllers: IController[]) {
        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }


    private initializeErrorHandler() {
        this.app.use(errorHandler);
    }
}


export default App;
