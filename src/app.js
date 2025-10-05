const express=require('express');
const cookieParser=require('cookie-parser');
const sellerRoutes=require('./routes/seller.routes');

const app=express();

app.use(express.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.status(200).json({
        "message": "Seller Dashboard Service is Running"
    });
});
app.use('/api/sellers/dashboard', sellerRoutes);




module.exports=app;