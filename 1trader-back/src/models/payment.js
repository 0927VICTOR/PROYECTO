const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('payment', {
    idPayment: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    investmentValue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    hour: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    result: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    statusPayment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    account_idAccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idAccount'
      }
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    price: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    percentage: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    value: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    movement: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'payment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPayment" },
        ]
      },
      {
        name: "fk_payment_account1_idx",
        using: "BTREE",
        fields: [
          { name: "account_idAccount" },
        ]
      },
    ]
  });
};
