// import { Model, DataTypes } from 'sequelize';
// import sequelize from './sequelize';
// import User from './user';

// class Order extends Model {
//   public id!: number;
//   public customerId!: number;
//   public amount!: number;
//   public transactionId!: string;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   public readonly user?: User;
// }

// Order.init(
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     customerId: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id',
//       },
//     },
//     amount: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//     },
//     transactionId: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'orders',
//   }
// );

// Order.belongsTo(User, { foreignKey: 'customerId', as: 'user' });

// export default Order;
