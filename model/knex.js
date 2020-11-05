const knex = require("../connection")

const csv = require('csv-parser');
const fs = require('fs');
const { nextTick } = require("process");

let postData = (req,res)=>{
    var file;
    if(!req.file)
    {
        res.send("File was not found");
        return;
    }
    file = req.file;  // here is the field name of the form
    console.log(req.body.title)
    fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (data) => {
        if(req.body.title === "userDetails"){
            let fullname = data['FirstName LastName']
            let obj = {
                EmailAddress: data['Email Address'],
                FullName: fullname,
                Address: data['Address'],
                ActivityLog: data['Activity Log'],
                DateofBirth: data['Date of Birth'],
                user_ID:data['Sl No.']
            }
            console.log(obj)
            var a=knex('User_Data').insert(obj)    //data inserting query
            .then((a) => { 
                console.log("data inserted")
            }) 
            .catch((err) => { 
                console.log(err)
            })
        }
        if (req.body.title === "jobTitle"){
            let obj = {
                JobTitle:data['Job Title'],
                EmailAddress:data['Email Address']
            }
            console.log(obj)
            var a=knex('Job_Profile').insert(obj) //data inserting query
            .then((a) => { 
                console.log("data inserted")
            }) 
            .catch((err) => { 
                console.log(err) 
            }) 
        }
        console.log(data)
    })
    .on('end', () => {
        res.send("File Uploaded");
    });
} 

let userLogin=(useremail)=>{
    return knex.select('*').from('User_Data').havingIn('EmailAddress',useremail)
}

let get_data_by_limit=(limit)=>{
    return knex.select("ID","JobTitle","Job_Profile.EmailAddress","FullName","DateofBirth","Address","ActivityLog")
    .from("Job_Profile")
    .join("User_Data","User_Data.Sl No","=","Job_Profile.ID").limit(limit)
    
} 

let get_table_data=()=>{
    return knex.select("*").from('Job_Profile')
}
module.exports={postData,userLogin,get_data_by_limit,get_table_data}
