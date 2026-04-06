const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('card', {
    idCard: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_login_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    cardNumber: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    cvv: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    expYear: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    month: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    termAndConditions: {
      type: DataTypes.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'card',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idCard" },
        ]
      },
      {
        name: "fk_card_user_login1_idx",
        using: "BTREE",
        fields: [
          { name: "user_login_id" },
        ]
      },
    ]
  });
};
