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
                console.log(paper.title)
                const result = await ctx.db.JurorPaper.findOneAndUpdate({ JID: args.JID },
                    {
                        $set: {
                            paperList: {
                                sid: args.sid,
                                title: paper.title,
                                time: Date.now()
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
        // JurorOwenrList: async () => null
    }
}
