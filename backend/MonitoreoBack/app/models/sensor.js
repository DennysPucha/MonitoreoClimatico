"use strict";

module.exports = (sequelize, DataTypes) => {
    const sensor = sequelize.define('sensor', {
        nombre: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        ip: { type: DataTypes.STRING(200), defaultValue: "NONE" },
        estado: { type: DataTypes.BOOLEAN, defaultValue: true },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });

    sensor.associate = function(models) {
        sensor.hasMany(models.reporte, {
            foreignKey: 'id_sensor', as: 'reporte'
        });
        sensor.belongsTo(models.persona, {
            foreignKey: 'id_persona'
        });
    };

    return sensor;
};