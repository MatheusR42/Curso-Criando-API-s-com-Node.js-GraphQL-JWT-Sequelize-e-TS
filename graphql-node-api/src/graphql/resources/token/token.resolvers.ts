import * as jwt from 'jsonwebtoken'
import { DbConnection } from "../../../interfaces/DbConnectionInterface"

export const tokenResolvers = {
    Mutation: {
        createToken: async (_parent, { email, password }, {db}: {db: DbConnection}) => {
            const user = await db.User.findOne({
                where: { email },
                attributes: ['id', 'password']
            })

            if (!user || !user.isPassword(user.get('password'), password)) {
                throw new Error('Unauthorized, wrong e-mail or password')
            }

            const payload = { sub: user.get('id') }

            return {
                token: jwt.sign(payload, process.env.JWT_SECRET)
            }
        }
    }
}