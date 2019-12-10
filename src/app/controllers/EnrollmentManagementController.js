import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO, addMonths, isBefore } from 'date-fns';

import Student from '../models/Student';
import PlanManagement from '../models/PlanManagement';
import EnrollmentManagement from '../models/EnrollmentManagement';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentManagementController {
  async index(req, res) {
    const enrollments = await EnrollmentManagement.findAll();

    return res.json({ enrollments });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await PlanManagement.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const start_date = startOfDay(parseISO(req.body.start_date));
    const end_date = endOfDay(addMonths(start_date, plan.duration));
    const price = plan.getTotalPrice();

    if (isBefore(start_date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'this date has passed' });
    }

    const enrollment = await EnrollmentManagement.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    await Queue.add(EnrollmentMail.key, { enrollment, student, plan });

    return res.json({ enrollment });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id } = req.body;

    const enrollment = await EnrollmentManagement.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await PlanManagement.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const start_date = startOfDay(parseISO(req.body.start_date));

    if (isBefore(start_date, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'this date has passed' });
    }

    const end_date = endOfDay(addMonths(start_date, plan.duration));
    const price = plan.getTotalPrice();

    const newEnrollment = await enrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json({ newEnrollment });
  }

  async delete(req, res) {
    const enrollment = await EnrollmentManagement.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    await enrollment.destroy();
    return res.json({ ok: true });
  }
}

export default new EnrollmentManagementController();
