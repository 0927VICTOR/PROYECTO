const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('country', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ESPANOL: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ENGLISH: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ISO2: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ISO3: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PHONE_CODE: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'country',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
