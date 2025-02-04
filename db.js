const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://booking:booking@cluster0.w8qtl.mongodb.net/mern-rooms'

mongoose.connect(mongoURL , {useNewUrlParser:true})

var connection = mongoose.connection
connection.on('error' , () =>{
    console.log('Mongo DB connection failed')
})

connection.on('connected' , () =>{
    console.log('Mongo DB connection successful')
})

module.exports = mongoose