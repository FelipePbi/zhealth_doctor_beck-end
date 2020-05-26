import mongoose from 'mongoose';

export const MedicamentSchema = new mongoose.Schema({
  prescription_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  dosage: {
    type: Number,
    required: true,
  },
  frequency_of_use: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Medicament', MedicamentSchema);
