import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uf_states_enum from '../enums/UfStateEnum';
import gender_enum from '../enums/GenderEnum';

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    required: true,
    maxlength: 11,
    unique: true,
  },
  crm: {
    type: Number,
    required: true,
    unique: true,
  },
  crm_state_registration: {
    type: String,
    enum: uf_states_enum,
    required: true,
  },
  gender: {
    type: String,
    enum: gender_enum,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DoctorSchema.pre('save', function cript(next) {
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

class DoctorClass {
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

DoctorSchema.loadClass(DoctorClass);

export default mongoose.model('Doctor', DoctorSchema);
