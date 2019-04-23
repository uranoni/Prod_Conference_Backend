import {
  SchemaDirectiveVisitor,
  AuthenticationError
} from "apollo-server-express";

class isAuthenticated extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(root, args, ctx) {
      if (!ctx.user)
        throw new AuthenticationError(
          "You need to be authenticated to access this schema!"
        );
      const result = await resolve.apply(this, [root, args, ctx]);
      return result;
    };
  }
}

export default isAuthenticated;
