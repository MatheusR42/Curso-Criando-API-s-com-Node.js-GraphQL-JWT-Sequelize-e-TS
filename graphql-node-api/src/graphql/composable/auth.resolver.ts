import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";

export const authResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, ctx: ResolverContext, info) => {
    if (ctx.user || ctx.authorization) {
      return resolver(parent, args, ctx, info);
    }

    throw new Error("Unauthorized! Token not provided.");
  };
};
