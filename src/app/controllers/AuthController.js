import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import Doctor from '../models/Doctor';
import authConfig from '../../config/auth';

class AuthController {
  async login(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(6),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { email, password } = req.body;
      const doctor = await Doctor.findOne({ email });

      if (!doctor) return res.status(404).json({ success: false, error: 'Email not registred' });

      if (!(await doctor.checkPassword(password)))
        return res.status(401).json({ success: false, error: 'Password does not match' });

      const { id, name } = doctor;

      return res.json({
        success: true,
        error: [],
        result: {
          doctorName: name,
          token: jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn }),
        },
      });
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

export default new AuthController();
