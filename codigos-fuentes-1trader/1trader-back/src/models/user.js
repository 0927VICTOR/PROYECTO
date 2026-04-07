const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idUser: {
      type: DataTypes.STRING(8),
      allowNull: true
    },
    fullName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    secondName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(17),
      allowNull: true
    },
    documentNumber: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    documentType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document_type',
        key: 'idDocument_type'
      }
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    statusActive: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    rol_idrol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rol',
        key: 'idRol'
      }
    },
    account_idaccount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'idAccount'
      }
    },
    termsAndConditions: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    finishRegister: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    documentImagenFront: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    documentImagenPost: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    indicative: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    postalCode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    hour: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    accountVerify: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user',
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
      {
        name: "fk_user_login_rol_idx",
        using: "BTREE",
        fields: [
          { name: "rol_idrol" },
        ]
      },
      {
        name: "fk_user_login_account1_idx",
        using: "BTREE",
        fields: [
          { name: "account_idaccount" },
        ]
      },
      {
        name: "fk_user_login_document_type1_idx",
        using: "BTREE",
        fields: [
          { name: "documentType" },
        ]
      },
    ]
  });
};
