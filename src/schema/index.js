import path from 'path'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { makeExecutableSchema } from 'graphql-tools'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')), { all: true });

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

export default schema;