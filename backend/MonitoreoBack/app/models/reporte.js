"use strict";



module.exports = (sequelize, DataTypes) => {
    const reporte = sequelize.define('reporte', {
        fecha: { type: DataTypes.DATEONLY },
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