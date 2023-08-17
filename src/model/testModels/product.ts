// import { Model, DataTypes } from 'sequelize';
// import sequelize from './sequelize';

// class Product extends Model {
//   public id!: number;
//   public name!: string;
//   public description!: string;
//   public price!: number;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// Product.init(
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//     },
//     price: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     tableName: 'products',
//   }
// );

// export default Product;
