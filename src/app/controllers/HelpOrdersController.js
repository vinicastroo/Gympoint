import HelpOrders from '../models/HelpOrders';
import Student from '../models/Student';

import HelpOrdersMail from '../jobs/HelpOrdersMail';
import Queue from '../../lib/Queue';

class HelpOrdersController {
  async index(req, res) {
    if (req.params.student_id !== undefined) {
      const helps = await HelpOrders.findAll({
        where: { student_id: req.params.student_id },
      });

      return res.json({ helps });
    }

    const helps = await HelpOrders.findAll({ where: { answer: null } });

    return res.json({ helps });
  }

  async store(req, res) {
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const { question } = req.body;

    const help = await HelpOrders.create({ student_id, question });

    return res.json({ help });
  }

  async update(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrders.findOne({ where: { id, answer: null } });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help not found' });
    }

    const student = await Student.findByPk(helpOrder.student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const { answer } = req.body;
    const answer_at = new Date();

    const help = await helpOrder.update({ answer, answer_at });

    await Queue.add(HelpOrdersMail.key, { help, student });

    return res.json({ help });
  }
}

export default new HelpOrdersController();
