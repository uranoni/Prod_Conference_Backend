// import './config/config.dev.json'
import express from "express";
import mongoose from "mongoose";
import { ApolloServer, PubSub } from "apollo-server-express";
import { authentication } from "./utilts/authentication";
import http from "http";
// import https from 'https'
import morgan from "morgan";
import schema from "./schema";
import db from "./models/db";
// import processUpload from './utilts/processUpload'
// import initApp from './utilts/initApp'
import path from "path";
// import cors from 'cors'

const pubsub = new PubSub();
const app = express();
// app.use(cors())
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(__dirname, "./uploads")));

console.log(__dirname);
mongoose
  .connect("mongodb://localhost/conference", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to Database!");
    // return initApp()
  });
// .then(user => {
//     if (user.message) {
//         console.log(user.message)
//     } else {
//         console.log(user._id)
//     }
// }).catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
// });
mongoose.set("useCreateIndex", true);

const context = async ({ req, res }) => {
  try {
    const { user, token } = await authentication(req);
    let ctx = { req, res, db, pubsub };
    if (user) {
      ctx = { ...ctx, user, token };
    }
    return ctx;
  } catch (err) {
    console.log("context error: ", err);
  }
};

const apolloServer = new ApolloServer({ schema, context, cors: true, db });
apolloServer.applyMiddleware({ app });

let server;
server = http.createServer(app);

// Add subscription support
apolloServer.installSubscriptionHandlers(server);

server.listen({ port: 4000 }, () => {
  console.log("localhost:4000");
});
