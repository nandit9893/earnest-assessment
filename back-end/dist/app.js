"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error("Blocked by CORS:", origin);
        }
    },
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("✅ Server is running correctly!");
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("/public"));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
exports.default = app;
//# sourceMappingURL=app.js.map