"use strict";

module.exports = (sequelize, DataTypes) => {
    const pronostico = sequelize.define('pronostico', {
        temperatura: { type: DataTypes.DOUBLE },
        resumen:{  type: DataTypes.STRING(300), defaultValue: "NONE"  },
        tipo_pronostico:{type: DataTypes.ENUM('SEMANAL','DIA_ESPECIFICO'),allowNull: false, defaultValue: 'SEMANAL'},
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { timestamps: false, freezeTableName: true });
    pronostico.associate=function(models){
        pronostico.belongsTo(models.persona,{
            foreignKey:'id_pronostico',as:'persona'
        });
    };
    return pronostico;
};
