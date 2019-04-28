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
        getAllJurorPaper: async (_, args, ctx) => {
            try {
                const result = await ctx.db.JurorPaper.find()
                console.log(result)
                return result
            } catch (error) {
                throw UserInputError("not found")
            }



        },

    },

    Mutation: {
        addOnePaperToJuror: async (root, args, ctx) => {

            try {
                const paper = await ctx.db.Submission.findOne({ sid: args.sid })
                const result = await ctx.db.JurorPaper.findOneAndUpdate(
                    {
                        JID: args.JID
                    },
                    {
                        $addToSet: {
                            paperList: {
                                _id: args.sid,
                                title: paper.title
                            }
                        }
                    },
                    { upsert: true, new: true, setDefaultsOnInsert: true })
                console.log(result)
                return result
            } catch (error) {
                throw AuthenticationError("系統參數設定錯誤")
            }
        },
        changePaperStatus: async (root, args, ctx) => {
            try {
                const JID = ctx.user.id
                const paper = await ctx.db.Submission.findOne({ sid: args.sid })
                const result = await ctx.db.JurorPaper.findOneAndUpdate(
                    {
                        "JID": JID,
                        "paperList._id": args.sid
                    },
                    {
                        $set: {
                            "paperList.$._id": paper.sid,
                            "paperList.$.title": paper.title,
                            "paperList.$.status": args.status,
                            "paperList.$.time": Date.now()

                        }
                    },
                    { new: true })
                console.log(result)
                return result
            } catch (error) {
                throw AuthenticationError("found not")
            }
        }
        // JurorOwenrList: async () => null
    }
}
