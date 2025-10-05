require('dotenv').config(); 
const { connect } = require('./src/broker/broker');
const app=require('./src/app');
const connectDB = require('./src/db/db');
const listener = require('./src/broker/listner');



connectDB()
connect().then
(()=>{
   
    listener();
}).catch((err)=>{
    console.log("Error in connecting to RabbitMQ",err);
});

app.listen(3007,()=>{
    console.log("Seller Dashboard is running on port 3007");
});