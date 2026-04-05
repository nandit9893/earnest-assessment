"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_js_1 = __importDefault(require("./configure/database.js"));
const app_js_1 = __importDefault(require("./app.js"));
dotenv_1.default.config();
(0, database_js_1.default)()
    .then(() => {
    app_js_1.default.listen(process.env.PORT, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
    .catch((err) => {
    console.log("Monogo db conncection failed !!!", err);
});
//# sourceMappingURL=index.js.map