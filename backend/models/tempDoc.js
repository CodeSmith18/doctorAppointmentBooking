import mongoose from "mongoose";

const tempdoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  slots_booked: { type: Object, default: {} },
  address: { type: String },
  date: { type: Number, required: true },
}, { minimize: false });

const tempdoctorModel = mongoose.models.tempdoctor || mongoose.model("tempdoctor", tempdoctorSchema);
export default tempdoctorModel;
