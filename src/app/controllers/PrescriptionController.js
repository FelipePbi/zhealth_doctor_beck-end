import * as Yup from 'yup';
import Doctor from '../models/Doctor';
import Prescription from '../models/Prescription';
import Medicament from '../models/Medicament';
import isValidCPF from '../utils/isValidCPF';

class PrescriptionController {
  async index(req, res) {
    const { currentDoctor } = req;
    const doctorExist = await Doctor.findById(currentDoctor);

    if (!doctorExist) res.status(404).json({ success: false, error: 'Doctor not found.' });

    const prescriptions = await Prescription.aggregate([
      {
        $match: {
          doctor_id: doctorExist._id,
        },
      },
      {
        $lookup: {
          from: 'medicaments',
          localField: '_id',
          foreignField: 'prescription_id',
          as: 'medicament_list',
        },
      },
    ]);

    const { name: name_doctor, cpf: cpf_doctor, crm, crm_state_registration } = doctorExist;

    const prescription_list = prescriptions.map(x => ({
      _id: x._id,
      name_doctor,
      cpf_doctor,
      crm,
      crm_state_registration,
      name_patient: x.name_patient,
      cpf_patient: x.cpf_patient,
      date_of_birt_patient: x.date_of_birt_patient,
      createdAt: x.createdAt,
      medicament_list: x.medicament_list,
    }));

    return res.json({ success: true, error: '', result: prescription_list });
  }

  async store(req, res) {
    try {
      const { currentDoctor } = req;

      const schema = Yup.object().shape({
        name_patient: Yup.string().required(),

        cpf_patient: Yup.string()
          .required()
          .max(11)
          .min(11),

        date_of_birt_patient: Yup.date().required(),
        medicament_list: Yup.array()
          .of(
            Yup.object().shape({
              description: Yup.string().required(),
              quantity: Yup.number().required(),
              dosage: Yup.number().required(),
              frequency_of_use: Yup.number().required(),
            })
          )
          .required(),
      });

      await schema.validate(req.body, { abortEarly: false });

      if (!isValidCPF(req.body.cpf_patient))
        return res.status(400).json({ success: false, error: 'cpf_patient invalid.' });

      const doctorExist = await Doctor.findById(currentDoctor);
      if (!doctorExist) res.status(404).json({ success: false, error: 'Doctor not found.' });

      const { _id: doctor_id } = doctorExist;
      const { name_patient, cpf_patient, date_of_birt_patient, medicament_list } = req.body;

      const newPrescription = {
        doctor_id,
        name_patient,
        cpf_patient,
        date_of_birt_patient,
        medicament_list,
      };

      const { _id: prescription_id } = await Prescription.create(newPrescription);
      await Medicament.insertMany(medicament_list.map(x => ({ ...x, prescription_id })));

      return res
        .status(200)
        .json({ success: true, error: [], result: 'Prescription created successfully' });
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

export default new PrescriptionController();
