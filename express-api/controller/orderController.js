const OrderItem=require('../models/orderitemModel')
const Order=require('../models/orderModel')

//post order
exports.postOrder=async(req,res)=>{
    const orderItemIds=Promise.all(req.body.orderItems.map(async orderIem=>{
        let newOrderItem = new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem = await OrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdsResolved = await orderItemsIds
    // calculating total price
    const totalAmount = await Promise.all(orderItemIdsResolved.map(async orderId=>{
        const itemOrder = await OrderItem.findById(orderId).populate('product','product_price')
        const total = itemOrder.quantity*itemOrder.product.product_price
        return total
    }))
    //[400,500,2000]
    const totalPrice = totalAmount.reduce((a,b)=>{a+b,0})

    //save data
    let order = new Order({
        orderItems:orderItemIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        phone:req.body.phone,
        country:req.body.country,
        TotalPrice:totalPrice,
        user:req.body.user
    })
    order = await order.save()
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(order)
}