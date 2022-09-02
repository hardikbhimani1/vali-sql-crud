const express = require("express");
const app = express();
var bodyparser = require('body-parser')

const formData = require('express-form-data');


app.use(formData.parse());

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))


const register = require("./router/router");
app.use("/register",register);

const port = 5151;
app.listen(port,()=>{
    console.log(`listing port : ${port}`)
});