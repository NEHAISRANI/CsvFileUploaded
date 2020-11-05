var knex = require('./connection')

// 1 excel sheet data imported in mysql table
knex.schema.hasTable("Job_Profile").then((exists)=>{
    if (!exists){
        return knex.schema.createTable("Job_Profile",(table)=>{
            table.increments('ID');
            table.varchar('JobTitle');
            table.varchar('EmailAddress');
        })
    .catch((err)=>{
        console.log(err)
        })
    }
    return console.log("user_details has created")
})

knex.schema.hasTable("User_Data").then((exists)=>{
    if (!exists){
        return knex.schema.createTable("User_Data",(table)=>{
            table.increments('Sl No');
            table.varchar('EmailAddress');
            table.varchar('FullName');
            table.varchar('Address');
            table.varchar('ActivityLog');
            table.varchar('DateofBirth');
            table.integer('user_ID').unsigned().notNullable();
            table.foreign('user_ID').references('Job_Profile.ID')
        })
    .catch((err)=>{
        console.log(err)
        })
    }
    return console.log("user_details has created")
})



