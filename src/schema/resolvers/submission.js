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
import { fromBits } from 'long';

export default {
    Query: {
        getSubmission: async (_, { labels }, { db }) => {

            if (!labels) {
                console.log(1)
                return await db.Submission.find()
            }

        },

    },
    Mutation: {
        submitPaper: async (root, args, { db, user }) => {
            if (!user) {
                return new AuthenticationError('You must be logged in!')
            }
            const contact = {
                email: args.data.contactEmail,
                uersname: args.data.contactName,
                phone: args.data.phone || null
            }
            const labels = args.labels
            const paperid = uuidv4();
            const paper = {
                sid: paperid,
                title: args.data.title,
                contact,
                labels,
                abstract: args.data.abstract,
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
            const newSubmission = new db.Submission(paper)
            await newSubmission.save(function (err) {
                if (err) {
                    console.log(err)
                    return new ApolloError("Submit fail")
                }
            });

            const newComment = new db.Comment({ paperID: paper.sid })
            newComment.save()
            for (let i = 0; i < labels.length; i++) {
                const labelrsult = await db.LabelGroup.find({ "labelname": labels[i] })
                if (labelrsult.length == 0) {
                    const newgroup = new db.LabelGroup({
                        "labelname": labels[i],
                    })
                    newgroup.papers.push({
                        "paperID": paperid,
                        "paperTitle": paper.title,
                    })
                    newgroup.save()
                }
                else {
                    try {
                        labelrsult[0].papers.push({
                            "paperID": paperid,
                            "paperTitle": paper.title,
                        })
                        await labelrsult[0].save()
                        console.log(labelrsult[0])
                    }
                    catch (err) {
                        throw new ApolloError("Submit fail")
                    }


                }
            }

            return paper
        }

    }
}