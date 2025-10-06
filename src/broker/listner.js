const {subscribeToQueue} = require('./broker');
const userModel = require('../models/user.model');
const productModel = require('../models/product.model');
const orderModel = require('../models/order.model');
const paymentModel = require('../models/payement.model');
module.exports = async function (){
    subscribeToQueue("Auth_Seller_dashboard_user_created",async (data)=>{
        await userModel.create(data);
    });

    subscribeToQueue('seller_dashboard_Product_created',async (data)=>{
        await productModel.create(data);
    });

    subscribeToQueue('seller_dashboard_New_order',async (data)=>{
        await orderModel.create(data);
    });

    subscribeToQueue('seller_dashboard_Payment_order_initiated',async (data)=>{
        await paymentModel.create(data);
    });

    subscribeToQueue('seller_dashboard_Payment_order_completed', async (data) => {
    await paymentModel.findOneAndUpdate(
        { razorpayOrderId: data.razorpayOrderId },
        { ...data }
    );});

subscribeToQueue("order_service_payment_completed", async (data) => {
    console.log("Payment completed for order:", data);
    await orderModel.findByIdAndUpdate(data.order, { status: data.status });
});


}