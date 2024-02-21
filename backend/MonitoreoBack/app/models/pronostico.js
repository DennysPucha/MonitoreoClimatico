"use strict";

module.exports = (sequelize, DataTypes) => {
    const pronostico = sequelize.define('pronostico', {
        tipo_pronostico: { type: DataTypes.ENUM(['TEMPERATURA', 'HUMEDAD', 'PRESION_ATMOSFERICA']), defaultValue: "HUMEDAD" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        dato: { type: DataTypes.STRING(1000), allowNull: false },
        hora: { type: DataTypes.TIME, defaultValue: DataTypes.NOW },
        fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    }, {
        timestamps: false,
        freezeTableName: true,
    });

    return pronostico;
};
