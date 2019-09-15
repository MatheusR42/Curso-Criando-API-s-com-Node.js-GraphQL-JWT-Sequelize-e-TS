import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composable.resolver";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { verifyTokenResolver } from "./verify-token.resolver";

export const authResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, ctx: ResolverContext, info) => {
    if (ctx.authUser || ctx.authorization) {
      return resolver(parent, args, ctx, info);
    }

    throw new Error("Unauthorized! Token not provided.");
  };
};

export const authResolvers = [authResolver, verifyTokenResolver]
