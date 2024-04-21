import bcrypt from 'bcrypt';
import registerService from '../services/registerService.js';

const registerUser = async (req, res) => {
    // getting body data
    const {
        username,
        emailAddress,
        password,
        firstName,
        lastName,
        birthDate,
        gender
    } = req.body;

    // #TODO: data validation
    if (!username || !emailAddress || !password) {
        console.log('Every field must be completed.');
        return res.status(400).send('Please fill al the mandatory fields.');
    }

    bcrypt.hash(password, 8, async (err, hash) => {
        const userData = {
            username: username,
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            gender: gender,
            password: hash
        };

        try {
            await registerService.register(userData);
            if (err) {
                console.log(err);
                res.status(500).send('An error has occured while registering.');
            }
            res.status(200).send('New user was added to database.');
        } catch (error) {
            console.log(error);
            res.status(500).send('An error has occured while registering.');
        }
    });
};

export default { registerUser };
