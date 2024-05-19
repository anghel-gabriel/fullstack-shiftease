import mongoose from "mongoose";

const Schema = mongoose.Schema;

const shiftSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  hourlyWage: { type: Number, required: true },
  workplace: { type: String, required: true },
  comments: { type: String, required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profit: { type: Number, default: 0 },
});

const Shift = mongoose.model("Shift", shiftSchema);
export default Shift;
