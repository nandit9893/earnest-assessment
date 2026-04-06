import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import path from "path";
import employeeRouter from "./routes/employee.routes.ts";
import roleRouter from "./routes/role.routes.ts";
import websiteRouter from "./routes/website.routes.ts";
import subjectRouter from "./routes/subject.routes.ts";
import taskRouter from "./routes/task.routes.ts";
import moduleRouter from "./routes/modules.routes.ts";
import moduleFieldRouter from "./routes/modules.field.routes.ts";
import typeDefs from "./graphql/type.graphql.ts";
import resolvers from "./graphql/resolver.graphql.ts";
import logger from "./utils/combined.log.ts";

const app = express();
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").trim();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/employee", employeeRouter);
app.use("/role", roleRouter);
app.use("/website", websiteRouter);
app.use("/subject", subjectRouter);
app.use("/task", taskRouter);
app.use("/modules", moduleRouter);
app.use("/modules/list", moduleFieldRouter);

app.get("/", (req, res) => {
  res.send("✅ Server is running correctly!");
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
  expressMiddleware(server)
);

export default app; 