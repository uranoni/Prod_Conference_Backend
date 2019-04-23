import { SchemaDirectiveVisitor, ForbiddenError } from "apollo-server-express";

class isForbidden extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    let self = this;
    field.resolve = async function(root, args, ctx) {
      console.log(self.args.group);
      if (!self.args.role.some(e => e === ctx.user.access.role))
        throw new ForbiddenError("Not Forbidden~.");

      const result = await resolve.apply(this, [root, args, ctx]);
      return result;
    };
  }
}

export default isForbidden;
