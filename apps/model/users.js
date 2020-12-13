module.exports = (sequelize,type)=>{
    return sequelize.define("tb_users",{
        id:{
            type:type.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        username:{
            type:type.STRING,
            allowNull:false,
        },
        password:{
            type:type.STRING,
            allowNull:false,
        },
        name:{
            type:type.STRING,
        },
        code_security:{
            type:type.INTEGER,
        },
        type:{
            type:type.INTEGER,
            defaultValue:0
        },
    },{
        modelName:"user",
        timestamps:true,
        engine:"MYISAM"
    })
}