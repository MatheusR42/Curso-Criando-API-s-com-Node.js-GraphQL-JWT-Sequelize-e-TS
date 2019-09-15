import { GraphQLFieldResolver } from "graphql";
import * as jwt from "jsonwebtoken";
import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";

export const verifyTokenResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, ctx: ResolverContext, info) => {
    const token: string = ctx.authorization
      ? ctx.authorization.split(" ")[1]
      : null;
    
    return jwt.verify(token, process.env.JWT_SECRET, (err, _decoded) => {
      if (!err) {
        return resolver(parent, args, ctx, info);
      }

      throw new Error(`${err.name}: ${err.message}`);
    });
  };
};
