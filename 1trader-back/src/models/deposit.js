const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('deposit', {
    idDeposit: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ecommerce: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    depositDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    account_idaccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idAccount'
      }
    },
    idCard: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hour: {
      type: DataTypes.STRING(25),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'deposit',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idDeposit" },
        ]
      },
      {
        name: "fk_deposit_account1_idx",
        using: "BTREE",
        fields: [
          { name: "account_idaccount" },
        ]
      },
    ]
  });
};
