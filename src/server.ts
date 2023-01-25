import App from "./app";
import { VendorController } from "./controller/vendor.controller";

const app = new App([new VendorController()]);

app.listen();
