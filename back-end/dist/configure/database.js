"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const constant_js_1 = __importDefault(require("../constant.js"));
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose_1.default.connect(`${process.env.MONGODB_URL}/${constant_js_1.default}`);
        console.log(`\nMongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map