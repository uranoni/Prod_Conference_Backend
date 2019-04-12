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
        getPosts: async (_, args, ctx) => {
            if (Object.keys(args).length === 0) {
                console.log(1)
                const post = await ctx.db.Post.find()
                return post
            }
            else if (args.pid) {
                console.log(2)
                var post = await ctx.db.Post.find({ pid: args.pid })
                if (post.length === 0) {
                    return new ApolloError('Cound find')
                }
                else { 
                    return post
                }

            }
            else {
                console.log(3)
                var post = await ctx.db.Post.find({ "labels.label": args.labels })
                if (post.length === 0) {
                    return new ApolloError('Cound find')
                }
                return post
            }
        }
    },

    Mutation: {
        submitPost: async (root, args, ctx) => {
            if (!ctx.user) {
                return new AuthenticationError('You must be logged in!')
            }
            const labels = args.labels
            const authordata = {
                author: ctx.user.username,
                contact: ctx.user.email,
            }
            const author = []
            author.push(authordata)
            const post = {
                pid: uuidv4(),
                title: args.data.title,
                content: args.data.content,
                author,
                labels: args.labels,
                published: args.data.published,
                createAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }
            const newPost = new ctx.db.Post(post)
            await newPost.save(function (err) {
                if (err) {
                    console.log(err)
                    return ("Submit fail")
                }
            });

            return post
        }

    }
}