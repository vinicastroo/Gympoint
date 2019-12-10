import Sequelize, { Model } from 'sequelize';

class PlanManagement extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  getTotalPrice() {
    return this.price * this.duration;
  }
}

export default PlanManagement;
