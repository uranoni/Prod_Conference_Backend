import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
  ApolloError
} from "apollo-server-express";
import _ from "lodash";
import cryptoRandomString from "crypto-random-string";
import dayjs from "dayjs";

export default {
  Query: {
    checkToken: async (root, args, ctx) => {
      if ((await ctx.user) === null) {
        return new AuthenticationError(
          "You need to be authenticated to access this schema!"
        );
      }
      return ctx.user;
    },
    getUsers: async (root, args, ctx) => {
      const { db, user } = ctx;
      console.log(args);
      // if (!user || user.access.role !== "admin") {
      //     return new ForbiddenError("Permission Denied")
      // }

      const users = await db.User.find();
      console.log(users);
      return users;
    },
    users: async (root, args, ctx) => ctx.db.User.find()
  },
  Mutation: {
    updateUser: async (root, args, ctx) => {
      if (!ctx.user)
        return new AuthenticationError(
          "You must be logged in to edit the user!"
        );
      console.log(ctx.user);
      if (
        ctx.user.access.role !== "admin" ||
        ctx.user.access.group !== "center"
      )
        return new ForbiddenError("Permission Denied");
      try {
        const user = await ctx.db.User.findById(args.data.id);
        if (!user) return new UserInputError("You must be checked ID correct!");
        const body = _.pick(args.data, ["email", "access", "username"]);
        await user.updateOne({ $set: { ...body } });
        const updateUser = await ctx.db.User.findById(args.data.id);
        updateUser.token = updateUser.tokens[updateUser.tokens.length - 1];
        return updateUser;
      } catch (err) {
        throw new Error(err);
      }
    },
    signup: async (root, args, ctx) => {
      const device = ctx.req.get("user-agent");
      const { username, email, password } = args;
      const requestIp = ctx.req.connection.remoteAddress;
      const newUser = new ctx.db.User({ username, email, password });
      try {
        const saveUser = await newUser.save();
        const { token, user } = await saveUser.generateAuthToken(
          requestIp,
          device
        );
        ctx.res.header("x-access-token", token);
        // user.token = user.tokens[user.tokens.length - 1]
        user.tokens = user.tokens[user.tokens.length - 1];
        return user;
      } catch (err) {
        // console.log(err)
        throw new Error(err);
      }
    },
    login: async (root, args, { db, req, res, pubsub }) => {
      const device = req.get("user-agent");
      const { email, password } = args;
      const requestIp = req.connection.remoteAddress;
      try {
        const authUser = await db.User.findByCredentials(email, password);
        const { token, user } = await authUser.generateAuthToken(
          requestIp,
          device
        );
        res.header("x-access-token", token);
        user.tokens = user.tokens[user.tokens.length - 1];
        return user;
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },
    logout: (root, args, ctx) => {
      //   if (!ctx.user) {
      //     throw new Error("您尚未登入！");
      //   }
      return ctx.user
        .updateOne({
          $pull: {
            tokens: { token: ctx.token }
          }
        })
        .then(result => {
          return { message: "logout success!" };
        })
        .catch(err => {
          throw new Error(err);
        });
    },
    jurorVerifyEmail: async (root, args, ctx) => {
      const device = ctx.req.get("user-agent");
      const requestIp = ctx.req.connection.remoteAddress;
      const { email, labels, name } = { ...args };
      const password = cryptoRandomString(10);
      const token = cryptoRandomString(25);
      const exp = dayjs().add(1, "week");
      const verifyToken = { token, exp };
      const newUser = new ctx.db.User({
        username: name,
        email,
        password,
        verifyToken,
        "access.role": "juror",
        labels
      });
      try {
        const saveUser = await newUser.save();
        const { token, user } = await saveUser.generateAuthToken(
          requestIp,
          device
        );
        ctx.res.header("x-access-token", token);
        const jupaper = new ctx.db.JurorPaper({
          JID: newUser._id,
        })
        jupaper.save()
        user.tokens = user.tokens[user.tokens.length - 1];
        return user;
      } catch (err) {
        // console.log(err)
        throw new Error(err);
      }
    },
    verifyAccount: async (root, args, { db }) => {
      const { token } = args;
      try {
        const user = await db.User.findOne({
          "verifyToken.token": token,
          "verifyToken.exp": { $gte: dayjs() }
        });

        user.verify = true;
        user.save();
        return user;
      } catch (err) {
        throw new AuthenticationError("invaild token");
      }
    }
  }
};
