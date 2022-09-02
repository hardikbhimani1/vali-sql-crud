const con = require("../model/model");
const express = require("express")
const validator = require("validator");
const isSet = require("isset");
const app = express()
const bcrypt = require('bcrypt');
const e = require("express");
const saltRounds = 10;

exports.insert = ((req, res) => {
    var firstname = req.body.firstname
    var alfa = /^[a-zA-Z()]+$/
    var lastname = req.body.lastname 
    var contact = req.body.contact
    var temp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    var email = req.body.email
    var temp1 = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    var salary = req.body.salary
    var stemp = /^[0-9]*\.?[0-9]*$/
    var password = req.body.password
    var ptemp = /^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
    
   var asas = req.body
   console.log(asas);
    if(!isSet(firstname)){
        res.send({data: "pls enter firstname",status: false,responsecode: 0})
        return;
    }
    if( firstname == ' ' ||  !firstname.match(alfa)  ){
        res.send({data: "pls enter valid firstname",status: false,responsecode: 0})
        return;
    }
   
    if(!isSet(lastname)){
        res.end({data: "pls enter lastname",status: false,responsecode: 0})
        return;
    }
    if( lastname == ' ' ||  !lastname.match(alfa))
    {
        res.send({data: "pls enter valid lastname",status: false,responsecode: 0})
        return;
    }
    
    if(!isSet(contact)){
        res.send({data: "pls enter contact",status: false,responsecode: 0})
    }
    if( contact == ' ' ||  !contact.match(temp))
    {
        res.send({data: "pls enter valid contact",status: false,responsecode: 0})
        return;
    } 
    
    if(!isSet(email)){
        res.send({data: "pls enter email ",status: false,responsecode: 0})
        return
    }
    if( email == ' ' ||  !email.match(temp1))
    {
        res.send({data: "pls enter valid email ",status: false,responsecode: 0})
        return;
    }
   
    if(!isSet(salary)){
        res.send({data: "pls enter salary ",status: false,responsecode: 0})
        return
    }
    if(salary>1000000 || salary == ' ' ||  !salary.match(stemp))
    {
        res.send({data: "pls enter valid salary",status: false,responsecode: 0})
        return;
    }
    
    if(!isSet(password)){
        res.send({data: "pls enter password ",status: false,responsecode: 0})
        return
    }

    if(  password == ' ' ||  !password.match(ptemp))
    {
        res.send({data: "pls enter capital char,small char, special char and number totel char 6,",status: false,responsecode: 0})
        return;
    }

        
    var sql1 = `SELECT * FROM userdata where email="${email}" `
    console.log(sql1);
    con.query(sql1, function (err, result) {
        console.log("result:",result)
        if(result != '')
        {
            console.log(result)
            res.setHeader('Content-Type', 'application/json');
            console.log(result)
            res.send({data: "email alredy inserted",status: false,responsecode: 0});
            return;
        }
        else{
            bcrypt.hash(password, saltRounds, function(err, hash) {
            var sql = `INSERT INTO userdata (firstname, lastname,contact,email,salary,password) VALUES ("${firstname}","${lastname}","${contact}","${email}","${salary}","${hash}")`;
            con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted",result);
                var sel = `select * from userdata where id ="${result.insertId}" `
                con.query(sel, function (err, result) {
                    res.send({status: true,responsecode: 1,Message:"Data Inserted",data: result});
                })
            });
        })          
        

    }
})
})
 

exports.find = ((req, res) => {
    const a= req.body
    console.log("a = ",  a)
    const b = a.asc_desc
    const c = a.salary
    console.log("c=",c);
    console.log("b",b);
    const firstname = req.body.firstname
    const ad = req.body.asc_desc
    if(firstname != undefined){
        // console.log("hello");
         if(b != undefined && c != undefined){
            if(b == 'desc'){
                parseInt(c)
                console.log(c);
                var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%' and salary < ${c} ORDER BY id DESC `
                console.log("desc",sql)
                // console.log("helllo")
                con.query(sql, (err, result) => {
                    if (result == ""){
                        res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                    } 
                    else{
                        
                        res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data:result});
                    }
                })
            }
            else{
                parseInt(c)
                var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%' and salary < ${c} ORDER BY id ASC `
                console.log("asc",sql);
                con.query(sql, (err, result) => {
                if (result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                } 
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                }
            })
            }
        }
        if(c == undefined && b == undefined){
            console.log("firstname");
            var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%'`
            console.log(sql)

            con.query(sql, (err, result) => {
                if(result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                }
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data:result});
                }
            })
            return 
        }
        if(b == undefined){
            parseInt(c)
            var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%' and salary < ${c} `
            console.log(sql)
            
            con.query(sql, (err, result) => {
                 if(result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})  
                }
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data:result});
                }
            })
            return 
        }
        if(c == undefined){
            if(b == 'desc'){
                    console.log("desc");
                var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%' ORDER BY id DESC`
                console.log(sql)
                con.query(sql, (err, result) => {
                    if (result == ""){
                        res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                    } 
                    else{
                        
                        res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                    }
                })
            }
            else{
                console.log("asc");
                        var sql = `SELECT * FROM userdata where firstname like '${req.body.firstname}%' ORDER BY id ASC `
                        console.log(sql)
                        con.query(sql, (err, result) => {
                            console.log(result);
                            if (result == ""){
                                res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                            } 
                            else{
                                
                                res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                            }
                           
                        });
              }
        }         
    }
    else{
        if(b != undefined && c != undefined){
            if(b == 'desc'){
            console.log("desc");
            parseInt(c)
            var sql = `SELECT * FROM userdata where salary < ${c} ORDER BY id DESC`
            console.log(sql)
            con.query(sql, (err, result) => {
                if (result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                } 
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                }
            })
        }
        else{
                console.log("asc");
                parseInt(c)
            var sql = `SELECT * FROM userdata where salary < ${c} ORDER BY id ASC `
                console.log(sql)
            con.query(sql, (err, result) => {
                console.log(result);
                if (result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                } 
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                }
            });
        }
        }
        if(b == undefined && c == undefined){
            var sql = `SELECT * FROM userdata `
            console.log(sql)
            con.query(sql, (err, result) => {
                if (result == " "){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                } 
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                }
            })
        }
        if(b == undefined){
            parseInt(c)
            var sql = `SELECT * FROM userdata where salary < ${c} `
            console.log(sql)
            con.query(sql, (err, result) => {
                if (result == ""){
                    res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                } 
                else{
                    
                    res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                }
            })
        }
        if(c == undefined){
            if(b == 'desc'){
                    console.log("desc");
                var sql = `SELECT * FROM userdata ORDER BY id DESC`
                console.log(sql)
                con.query(sql, (err, result) => {
                    if (result == ""){
                        res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                    } 
                    else{
                        
                        res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                    }
                })
            }
            else{
                    console.log("asc");
                var sql = `SELECT * FROM userdata ORDER BY id ASC `
                    console.log(sql)
                con.query(sql, (err, result) => {
                    console.log(result);
                    if (result == ""){
                        res.send({status:false,responsecode: 0,Message:"Data Not Found"})
                    } 
                    else{
                        
                        res.send({status: true,responsecode: 1,Message:"Data Find Successfully",data: result});
                    }
                });
            }
        }
    }
})

exports.show = ((req, res) => {
    const ad = req.body
    console.log(ad);
    if( ad.ad != undefined ){
        if(ad.ad == 'subquery'){

        var sql = `SELECT orders.p_name, userdata.firstname, orders.price, orders.id
                    FROM orders, userdata
                    WHERE orders.id = userdata.id`
        console.log(sql)
        con.query(sql, (err, result) => {
            if (err) throw err;
            res.send({status: true,responsecode: 1,Message:" SubQuery Data",data: result});
        })
        }
        if(ad.ad == 'join'){
            var sql = `SELECT *
                            FROM Orders
                            INNER JOIN userdata
                            ON orders.id = userdata.id`
            console.log(sql)
            con.query(sql, (err, result) => {
                if (err) throw err;
                res.send({status: true,responsecode: 1,Message:" Join Data ",data: result});
            }) 
        }
    }
    else{
        var sql = `SELECT * FROM userdata`
        console.log(sql)
        con.query(sql, (err, result) => {
            if (err) throw err;
            res.send({status: true,responsecode: 1,Message:"All Data Show Successfully",data: result});
        });
    }
})

exports.update = ((req, res) => {
    var firstname = req.body.firstname
    var alfa = /^[a-zA-Z()]+$/
    var lastname = req.body.lastname 
    var contact = req.body.contact
    var temp = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    var email = req.body.email
    var temp1 = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
    var salary = req.body.salary
    var stemp = /^[0-9]*\.?[0-9]*$/
    var password = req.body.password
    var ptemp = /^(?=.{6,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/
    var id = req.body.id
    // console.log(firstname.match(alfa))
    // console.log(`abc: ${/^\d+$/.test('abc')}`)
    if(id == undefined || id == ''  ){
        res.end({data: "pls enter id ",status: false,responsecode: 0})
        return
    }
    if( firstname == undefined || firstname == '' ||  !firstname.match(alfa)  ){
        if(password == undefined){
            res.end({data: "pls enter firstname ",status: false,responsecode: 0})
            return
        }
        res.end({data: "pls enter valid firstname",status: false,responsecode: 0})
        return;
    }
    if( lastname == undefined  || lastname == '' ||  !lastname.match(alfa))
    {
        if(lastname == undefined){
            res.end({data: "pls enter lastname ",status: false,responsecode: 0})
            return
        }
        res.end({data: "pls enter valid lastname",status: false,responsecode: 0})
        return;
    }
    if( contact == undefined || contact == '' ||  !contact.match(temp))
    {
        if(contact == undefined){
            res.end({data: "pls enter contact ",status: false,responsecode: 0})
            return
        }
        res.end({data: "pls enter valid contact",status: false,responsecode: 0})
        return;
    }    
    if( email == undefined || email == '' ||  !email.match(temp1))
    {
        if(email == undefined){
            res.end({data: "pls enter email ",status: false,responsecode: 0})
            return
        }
        res.end({data: "pls enter valid email",status: false,responsecode: 0})
        return;
    }
    if( salary == undefined || salary == '' ||  !salary.match(stemp))
    {
        res.end({data: "pls enter valid salary",status: false,responsecode: 0})
        return;
    }
    if(salary>1000000 ){
        res.end({data: "pls enter less then 1000000 salary",status: false,responsecode: 0})
        return;
    }
    if( password == undefined || password == '' ||  !password.match(ptemp))
    {
        if(password == undefined){
            res.end({data: "pls enter password ",status: false,responsecode: 0})
            return
        }
        res.end({data: "pls enter cepital char,small char, special char and number totel char 6 ",status: false,responsecode: 0})
        return;
    }
    bcrypt.hash(password, saltRounds, function(err, hash) {
    var sql = `UPDATE userdata SET firstname = '${req.body.firstname}', lastname = '${req.body.lastname}' ,contact = '${req.body.contact}' , salary = '${req.body.salary}' , password = '${hash}' , email = '${req.body.email}' WHERE id = '${req.body.id}'`
    console.log(sql)
    con.query(sql, (err, result) => {
        if (err) throw err;
        var sel = `select * from userdata where id ="${id}" `
        con.query(sel, function (err, result) {
            if(result == ""){
                res.send({status: false,responsecode: 0,Message:"Enter valid data"})
            }
            else{
                
                res.send({status: true,responsecode: 1,Message:"Data Updated",data: result});
            }
        })
    });
})
})

exports.delete = ((req, res) => {
    var id = req.body.id
    console.log(id);
    if(id != undefined ){
        if(id == ''){
            res.end({data: "pls enter valid id",status: false,responsecode: 0 })
        }
        else{
            var sql = `DELETE FROM userdata WHERE id = '${req.body.id}'`
            con.query(sql, (err, result) => {
                if (err) throw err;
                if(result.affectedRows == 1){
                res.send({data: " deleted Successfully....",status: true,responsecode: 1 });
                }
                else{
                res.send({data: " Pls Enter Valid Data...",status: false,responsecode: 0 });  
                }
            });
        }
    }
    else{
        res.end({data:"pls enter id",status: true,responsecode: 1});
    }
})