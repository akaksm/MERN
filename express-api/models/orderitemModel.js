const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderItemSchema = new mongoose.Schema({
    quantity:{
        type:Number,
        require:true
    },
    product:{
        type:ObjectId,
        require:true,
        ref:'Product'
    }
},{timestamps:true})

module.exports=mongoose.model('OrderItem',orderItemSchema)