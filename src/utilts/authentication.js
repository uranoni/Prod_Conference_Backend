import User from '../models/user'

export const authentication = async (req) => {
    var token = req.header('authorization');
    if (token) {
        const user = await User.findByToken(token)
        return { user, token };
    }
    return false
}
