"use strict";



module.exports = (sequelize, DataTypes) => {
    const persona_sensor = sequelize.define('persona_sensor', {
        fecha_registro: { type: DataTypes.DATE },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });
    persona_sensor.associate=function(models){
        persona_sensor.hasMany(models.persona,{
            foreignKey:'id_persona_sensor', as:'persona'
        });
        persona_sensor.hasMany(models.sensor,{
            foreignKey:'id_persona_sensor', as:'sensor'
        });
    };
    return persona_sensor;
};