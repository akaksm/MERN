const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems:[{
        type:ObjectId,
        require:true,
        ref:'OrderItem'
    }],
    shippingAddress1:{
        type:String,
        require:true
    },
    shippingAddress2:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:Number,
        require:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'Pending',
        required:true
    },
    TotalPrice:{
        type:Number,
        require:true
    },
    user:{
        type:ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('Order',orderSchema)