// import { Model, DataTypes } from 'sequelize';
// import sequelize from './sequelize';
// import Order from './order';
// import Product from './product';

// class OrderItem extends Model {
//   public id!: number;
//   public orderId!: number;
//   public productId!: number;
//   public quantity!: number;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   public readonly order?: Order;
//   public readonly product?: Product;
// }

// OrderItem.init(
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     orderId: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//       references: {
//         model: 'orders',
//         key: 'id',
//       },
//     },
//     productId: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//       references: {
//         model: 'products',
//         key: 'id',
//       },
//     },
//     quantity: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'order_items',
//   }
// );

// OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
// OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
// export default OrderItem;
