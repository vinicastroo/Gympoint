import * as Yup from 'yup';

import Student from '../models/Student';

class StudentControleler {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(401).json({ error: 'User already exists' });
    }

    const { name, email, age, weight, height } = await Student.create(req.body);
    return res.json({ name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findOne({ where: { email: req.body.email } });

    if (!student) {
      return res.status(401).json({ error: 'Student not exists' });
    }

    const { name, email, age, weight, height } = await student.update(req.body);

    return res.json({ name, email, age, weight, height });
  }
}

export default new StudentControleler();
