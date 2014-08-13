/**
 * Created by Kiran Kuppa on 8/12/2014.
 */


"use strict";
var c ={
    database:"test_db",
    username:"alchemyuser",
    password:"admin",
    dialect: "postgres",
    port:"5432",
    force:false

}
var Promise =   require("bluebird");
var Sequelize = require("sequelize");
var sequelize = new Sequelize( c.database,c.username,
    c.password,{dialect :'postgres', port:'5432'});

var User =sequelize.define('User',{
    id:{ type: Sequelize.INTEGER,primaryKey:true, autoIncrement:true},
    name:{type:Sequelize.TEXT,allowNull:false},
    nick_name:{type:Sequelize.TEXT,allowNull:true},
    date_of_joining:{type:Sequelize.DATE,allowNull:false,defaultValue:Sequelize.NOW}

    },
    {
        tableName:"user",
        underscored:true,
        timestamps:false

    }
);

var Task = sequelize.define( 'Task',
    {
        id:{ type: Sequelize.INTEGER,primaryKey:true, autoIncrement:true},
        name:{type:Sequelize.TEXT,allowNull:false},
        begin_time:{type:Sequelize.DATE,allowNull:false,defaultValue:Sequelize.NOW},
        end_time:{type:Sequelize.DATE,allowNull:true}
    },
    {
        tableName:"task",
        underscored:true,
        timestamps:false

    }

);

var Address = sequelize.define( 'Address',
    {
        id:{ type: Sequelize.INTEGER,primaryKey:true, autoIncrement:true},
        addr_1:{ type:Sequelize.TEXT, allowNull:false},
        addr_2:{type:Sequelize.TEXT, allowNull:true},
        zip_code:{type:Sequelize.TEXT,allowNull:false}
    },
    {
        tableName:"address",
        underscored:true,
        timestamps:false

    }
);

User.hasMany( Task, {as:"Tasks"});

User.hasOne( Address, {as:"Address"});

sequelize.sync( {force:true}, {logging:console.log})
    .then( function( args ){

    var users =[
        {name:"Abraham Milbard"},
        {name:"Jimmy Quake"},
        {name:"John Amayo"}
    ];
    var tasks =[
        {name:"Bring 100 apples by today evening"},
        {name:"Do the dishes"},
        {name:"Watch soap and weep"},
        {name:"Bitch about your miserable life"}
    ];
    var address ={
        addr_1:"BLK 257, Kaki Bukit Ave 4",
        zip_code:"450213"
    };

var promiseAddData = function( user ){

    return new Promise( function( fulfill, reject){
        User.create( users[0])
            .then( function( usr ){
                var task = Task.build( tasks[0 ]);
                task.save().success( function( stask ){
                    usr.setTasks([stask]);
                });

                task = Task.build( tasks[1]);
                task.save().success( function( stask ){
                    usr.setTasks( [stask ]);
                });

                var addr = Address.build( address  )  ;
                addr.save().success( function( saddr ){
                    usr.setAddress( saddr);
                });
                fulfill( usr );
            });

    });
}
var promiseFindData = function( ){

    return new Promise(  function( fulfill, reject){
        User.findAll(
            {
                where:{id:1},
                include:[{model:Task}]
            }
        ).success( function ( usr ){
                fulfill( usr );
            }).error( function( err ){
                reject( err );
            })

    });
}

  promiseAddData()
      .then( promiseFindData())
      .then( function( usr ){
         console.log( " Queried user is "+usr['name']);
      }).done();
})


