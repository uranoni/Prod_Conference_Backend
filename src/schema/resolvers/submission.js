import {
    AuthenticationError,
    UserInputError,
    ForbiddenError,
    ApolloError
} from 'apollo-server-express';
import path from 'path'
import _ from 'lodash'
import fs from 'fs';
import uuidv4 from 'uuid/v4'
import dayjs from 'dayjs'

export default {
    Query: {
        getSubmission: (_, args, ctx) => ctx.db.Submission.find(),

    },
    Mutation: {
        submitPaper: async (root, args, ctx) => {
            if (!ctx.user) {
                return new AuthenticationError('You must be logged in!')
            }
            const contact = {
                email: args.data.contactEmail,
                uersname: args.data.contactName,
                phone: args.data.phone || null
            }
            const labels = args.labels

            const paper = {
                sid: uuidv4(),
                title: args.data.title,
                contact,
                labels,
                abstract: args.data.abstract,
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
            const newSubmission = new ctx.db.Submission(paper)
            newSubmission.save(function (err) {
                if (err) {
                    console.log(err)
                    return ("Submit fail")
                }
            });

            return paper
        }

    }
}