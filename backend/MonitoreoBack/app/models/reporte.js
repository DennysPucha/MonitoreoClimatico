"use strict";



module.exports = (sequelize, DataTypes) => {
    const reporte = sequelize.define('reporte', {
        fecha: { type: DataTypes.DATEONLY,defaultValue: DataTypes.NOW },
        hora_registro: { type: DataTypes.TIME, defaultValue: DataTypes.NOW },
        tipo_dato: { type: DataTypes.ENUM(['TEMPERATURA','HUMEDAD','PRESION_ATMOSFERICA']), defaultValue:"HUMEDAD"},
        dato: { type: DataTypes.STRING(1000),allowNull:false},
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });
    reporte.associate=function(models){
        reporte.belongsTo(models.sensor,{
            foreignKey:'id_sensor'
        });
    };
    return reporte;
};