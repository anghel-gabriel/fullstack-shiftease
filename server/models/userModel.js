import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const shiftSchema = new Schema({
	username: { type: String, required: true },
	emailAddress: { type: String, required: true },
	password: { type: Number, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
    birthDate: {type: String, required: true},
    gender: {type: Object},
});

export default mongoose.model('Shift', shiftSchema);