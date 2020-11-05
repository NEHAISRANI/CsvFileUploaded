let appDB = require("../model/knex")
const knex = require("../connection")
var multer=require('multer');
const { post_query } = require("../model/knex");
var upload = multer({ dest: './public/data/uploads/' })
var jwt = require('jsonwebtoken');


module.exports = (app) => {
    app.post('/upload', upload.single('file'), function (req, res) {
        appDB.postData(req,res)   
    });

    app.post('/user/login',(req,res)=>{
        let email=req.body.EmailAddress.trim()
        let data=appDB.userLogin(email)
        .then((data)=>{
            if(data.length==0){
                res.send("email and dob not exists")
            } 
            else{
                // console.log(email)
                if(data[0]["EmailAddress"] == email){
                    console.log(data[0]["EmailAddress"])
                    let token = jwt.sign({email},"my_secreat_key")
                    res.cookie(token)
                    res.json("login sucessfully")
                } 
                else{ 
                  res.send("wrong  password")
                }             }
        }).catch((err)=>{  
            res.send(err)   
        })
    }) 


    app.get('/getData/:limit', (req, res) => {
        var limit=req.params.limit
        let token = req.headers.cookie
        let token1 = token.split("=")
        jwt.verify(token1[0],"my_secreat_key",function(err,data){
            var a=appDB.get_data_by_limit(limit)
            a.then((data) => { 
                res.send(data) 
            }) 
            .catch((err) => { 
                res.send(err) 
            })
        })
    }) 

    app.get('/jobTitle',(req,res)=>{
        let table_Data=appDB.get_table_data()
        object={}
        table_Data.then((data)=>{
        // console.log(data)
        for (i of data){
            if(object.hasOwnProperty(i["JobTitle"])){
                key=(i["JobTitle"])
                object[key]+=1
            }
            else{
                key=(i["JobTitle"])
                object[key]=1
            }
        }
        res.send(object)
        }).catch((err)=>{
            res.send(err)
        })
    })
}

