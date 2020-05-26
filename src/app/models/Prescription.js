import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  doctor_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  name_patient: {
    type: String,
    trim: true,
    required: true,
  },
  cpf_patient: {
    type: String,
    required: true,
    maxlength: 11,
    unique: true,
  },
  date_of_birt_patient: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Prescription', PrescriptionSchema);
