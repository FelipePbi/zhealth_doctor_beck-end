import * as Yup from 'yup';
import Doctor from '../models/Doctor';
import uf_states_enum from '../enums/UfStateEnum';
import gender_enum from '../enums/GenderEnum';
import isValidCPF from '../utils/isValidCPF';

class DoctorController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),

        email: Yup.string()
          .required()
          .email(),

        password: Yup.string()
          .required()
          .min(6),

        confirmPassword: Yup.string()
          .required()
          .min(6)
          .oneOf([Yup.ref('password')], 'confirmPassword and password must be equals'),

        cpf: Yup.string()
          .required()
          .max(11)
          .min(11),

        date_of_birth: Yup.date().required(),

        gender: Yup.string()
          .required()
          .oneOf(gender_enum),

        crm: Yup.number().required(),

        crm_state_registration: Yup.string()
          .required()
          .oneOf(uf_states_enum),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { email, crm, cpf } = req.body;

      if (!isValidCPF(cpf)) return res.status(400).json({ success: false, error: 'cpf invalid.' });

      const doctorExist = await Doctor.findOne({ $or: [{ email }, { crm }, { cpf }] });

      if (doctorExist)
        return res.status(400).json({ success: false, error: 'Doctor already exists.' });

      await Doctor.create(req.body);

      return res
        .status(200)
        .json({ success: true, error: [], result: 'Doctor created successfully' });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        });

        return res.status(400).json({ success: false, error: errorMessages });
      }
      return res.status(400).json({ success: false, error: err });
    }
  }
}

export default new DoctorController();
