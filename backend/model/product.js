 const mongoose = require("mongoose");

 const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: [true, "Please enter your product description"]
    },
    tags:{
        type: String,
    },
    couponCode: {
        type: String,
        default: "",
        trim: true,
    },
     orignalPrice:{
         type:  Number,
     },
     discountPrice:{
         type: Number,
     },
     stock :{
         type: Number,
         required: [true, "please enter your produuct stock"]
     },
     images:[ 
         {
         type: String,
     }
 ],
     shopId: {
         type: String,
         required: true,
     },
     shop: {
         type: Object,
         required: true,
     },
     sold_out: {
         type: Number,
         default: 0,
     },
     rating: {
         type: Number,
         default: 0,
     },
     reviews: [
         {
             user: {
                 id: String,
                 name: String,
                 avatar: String,
             },
             rating: {
                 type: Number,
                 required: true,
             },
             message: {
                 type: String,
                 required: true,
             },
             orderId: {
                 type: String,
                 default: "",
             },
             hasPurchased: {
                 type: Boolean,
                 default: false,
             },
             createdAt: {
                 type: Date,
                 default: Date.now,
             },
         },
     ],
     createdAt: {
         type: Date,
         default: Date.now(),
     }
 });
 module.exports = mongoose.model("Product" , productSchema);
