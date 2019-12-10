import { addWeeks, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import StudentCheckin from '../models/StudentCheckin';

class StudentCheckinController {
  async index(req, res) {
    const checkins = await StudentCheckin.findAll({
      where: {
        created_at: {
          [Op.between]: [
            startOfDay(new Date()),
            endOfDay(addWeeks(new Date(), 1)),
          ],
        },
        student_id: req.params.student_id,
      },
    });

    return res.json({ checkins });
  }

  async store(req, res) {
    const checkins = await StudentCheckin.findAll({
      where: {
        created_at: {
          [Op.between]: [
            startOfDay(new Date()),
            endOfDay(addWeeks(new Date(), 1)),
          ],
        },
        student_id: req.params.student_id,
      },
    });

    if (checkins.length > 4) {
      return res
        .status(401)
        .json({ error: 'You have exceeded the limit of 5 weekly checkins' });
    }

    const checkin = await StudentCheckin.create({
      student_id: req.params.student_id,
    });

    return res.json({ checkin });
  }
}

export default new StudentCheckinController();
