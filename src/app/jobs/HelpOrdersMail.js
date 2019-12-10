import Mail from '../../lib/Mail';

class HelpOrdersMail {
  get key() {
    return 'HelpOrdersMail';
  }

  async handle({ data }) {
    const { help, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Reposta HelpOrder GymPoint',
      template: 'helpOrder',
      context: {
        student: student.name,
        question: help.question,
        answer: help.answer,
      },
    });
  }
}

export default new HelpOrdersMail();
