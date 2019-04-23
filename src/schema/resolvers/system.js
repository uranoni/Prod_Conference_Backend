import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
  ApolloError
} from "apollo-server-express";
import path from "path";
import _ from "lodash";
import fs from "fs";
import dayjs from "dayjs";

export default {
  Query: {
    getSystemArgs: async (root, args, ctx) => {
      try {
        const result = await ctx.db.System.find();
        return result
      } catch (error) {
        throw new AuthenticationError("使用者權限錯誤");
      }
    }
  },
  Mutation: {
    createBasicArgs: async (root, args, ctx) => {
      console.log(args)
      const ConferenData = {
        ...args.data
      }
      const ConferenArgs = new ctx.db.System(ConferenData);
      try {
        const result = await ConferenArgs.save()
        console.log(result)
        return result
      } catch (error) {
        throw UserInputError("系統參數設定錯誤")
      }
    },
    createConferenceTopic: async () => null,
    createOrganizerContact: async () => null
  }
}