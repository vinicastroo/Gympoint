import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import PlanManagement from '../app/models/PlanManagement';
import EnrollmentManagement from '../app/models/EnrollmentManagement';
import StudentCheckin from '../app/models/StudentCheckin';
import HelpOrders from '../app/models/HelpOrders';

import databaseConfig from '../config/database';

const models = [
  User,
  Student,
  PlanManagement,
  EnrollmentManagement,
  StudentCheckin,
  HelpOrders,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
