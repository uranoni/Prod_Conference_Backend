import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
  ApolloError
} from "apollo-server-express";
import path from "path";
import _ from "lodash";
import fs from "fs";
import uuidv4 from "uuid/v4";
import dayjs from "dayjs";

export default {
  Query: {
    getPosts: async (_, args, ctx) => {
      const cloneSort = { ...args.sort };
      const category = args.category || null;
      const getConfig = {
        skip: args.skip || 0,
        limit: args.limit || 0,
        sort: {
          sortBy: cloneSort.sortBy || "ID",
          postive: cloneSort.postive || "DESC"
        }
      };

      return ctx.db.Post.find(category ? { category } : {})
        .limit(getConfig.limit)
        .skip(getConfig.skip)
        .sort({
          [getConfig.sort.sortBy === "ID" ? "_id" : "updatedAt"]: getConfig.sort
            .postive
        });
    },
    getPost: (_, args, ctx) => ctx.db.Post.findOne({ pid: args.postPid })
  },

  Mutation: {
    submitPost: async (root, args, ctx) => {
      console.log(ctx.user)
      const author = {
        author: ctx.user.username,
        contact: ctx.user.email
      };

      const post = {
        pid: uuidv4(),
        title: args.data.title,
        content: args.data.content,
        author,
        category: args.data.category,
        published: args.data.published
      };

      const newPost = new ctx.db.Post(post);
      return newPost.save();
    },
    updatePost: async (root, args, ctx) => {
      const post = await ctx.db.Post.findOne({ pid: args.postPid });
      if (!post)
        throw new UserInputError("Post pid is Not Found! pid: " + args.userPid);
      try {
        await post.updateOne({ $set: { ...args.data } });
        return ctx.db.Post.findOne({ pid: args.postPid });
      } catch (err) {
        throw new Error(err);
      }
    },
    deletePost: async (root, args, ctx) => {
      const post = await ctx.db.Post.findOne({ pid: args.postPid });
      if (!post)
        throw new UserInputError("Post pid is Not Found! pid: " + args.userPid);
      try {
        await post.remove();
        return {
          deleteMsg: "SUCCESS",
          deletePid: args.postPid,
          title: post.title
        };
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};
