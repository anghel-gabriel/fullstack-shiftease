import User from '../models/userModel.js';

const register = async (userData) => {
    try {
        await User.create(userData);
    } catch (error) {
        console.log(error);
    }
};

export default { register };
