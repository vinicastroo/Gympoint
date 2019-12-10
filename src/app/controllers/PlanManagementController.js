import * as Yup from 'yup';
import PlanManagement from '../models/PlanManagement';

class PlanManagementController {
  async index(req, res) {
    const plans = await PlanManagement.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price } = await PlanManagement.create(
      req.body
    );

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await PlanManagement.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({ title, duration, price });
  }

  async delete(req, res) {
    const plan = await PlanManagement.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'plan not found' });
    }

    await plan.destroy();
    return res.json({ ok: true });
  }
}

export default new PlanManagementController();
