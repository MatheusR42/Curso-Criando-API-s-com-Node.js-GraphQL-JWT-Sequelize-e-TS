import { GraphQLResolveInfo } from "graphql";
import * as graphqlFields from "graphql-fields";
import { difference, union } from "lodash";

export class RequestedFields {
  getFields(
    info: GraphQLResolveInfo,
    options?: { keep?: string[]; exclude?: string[] }
  ): string[] {
    let fields: string[] = Object.keys(graphqlFields(info));

    if (!options) {
      return fields;
    }

    const { keep, exclude } = options;

    fields = keep ? union<string>(fields, keep) : fields;

    return exclude ? difference<string>(fields, exclude) : fields;
  }
}
