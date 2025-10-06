const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const paymentModel = require("../models/payement.model");
const jwt = require("jsonwebtoken");




async function getMetrics(req, res) {
    try {
        const seller = req.user;
        console.log("Seller info:", seller); // ✅ Check seller ID

        // Get all products for this seller
        const products = await productModel.find({ seller: seller.id });
        console.log("Seller's products:", products.map(p => ({ id: p._id.toString(), title: p.title })));

        // Convert product IDs to string to avoid ObjectId vs string mismatch
        const productIds = products.map(p => p._id.toString());
        console.log("Product IDs:", productIds);

        // Get all orders containing seller's products with certain statuses
        const allOrders = await orderModel.find({
            'items.product': { $in: productIds },
            status: { $in: ["CONFIRMED", "SHIPPED", "DELIVERED"] }
        });
        console.log("Orders count fetched:", allOrders.length);

        // Sales: total number of items sold & revenue
        let sales = 0;
        let revenue = 0;
        const productSales = {};

        allOrders.forEach(order => {
            order.items.forEach(item => {
                if (productIds.includes(item.product.toString())) {
                    sales += item.quantity;
                    revenue += item.price.amount * item.quantity;
                    const pid = item.product.toString();
                    productSales[pid] = (productSales[pid] || 0) + item.quantity;
                }
            });
        });

        console.log("Product sales mapping:", productSales);

        // Top products by quantity sold
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId, qty]) => {
                const prod = products.find(p => p._id.toString() === productId);
                return prod ? { id: prod._id, title: prod.title, sold: qty } : null;
            })
            .filter(Boolean);

        console.log("Top products:", topProducts);

        return res.json({
            sales,
            revenue,
            topProducts
        });
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function getOrders(req, res) {
    try {
        const seller = req.user;
        console.log("Seller info:", seller); // ✅ Check if seller ID is correct

        // Get all products for this seller
        const products = await productModel.find({ seller: seller.id });
        console.log("Seller's products:", products.map(p => ({ id: p._id.toString(), title: p.title })));

        // Convert product IDs to string to avoid ObjectId vs string mismatch
        const productIds = products.map(p => p._id.toString());
        console.log("Product IDs:", productIds);

        // Get all orders
        const allOrders = await orderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
        console.log("All orders count:", allOrders.length);

        // Filter order items to only include those from this seller
        const filteredOrders = allOrders.map(order => {
            const filteredItems = order.items.filter(item => productIds.includes(item.product.toString()));
            return {
                ...order.toObject(),
                items: filteredItems
            };
        }).filter(order => order.items.length > 0);

        console.log("Filtered orders count:", filteredOrders.length);
        console.log("Filtered orders:", filteredOrders);

        return res.json(filteredOrders);
    } catch (error) {
        console.error("Error fetching orders:", error)
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function getProducts(req, res) {

    try {
        const seller = req.user;

        const products = await productModel.find({ seller: seller.id }).sort({ createdAt: -1 });

        return res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error)
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

}
module.exports = { getMetrics, getOrders, getProducts };