import { UserModel, UserInstance } from "../../models/UserModel";
import { DataLoaderParam } from "../../interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class UserLoader {
  static batchUsers(User: UserModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<UserInstance[]> {
    const ids: number[] = params.map(item => item.key)

    return User.findAll({
      where: {
        id: { $in: ids }
      },
      attributes: requestedFields.getFields(params[0].info, { keep: ['id'], exclude: ['posts'] })
    });
  }
}
