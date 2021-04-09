'use strict';
var mongoose=require("mongoose");
const mongooseDateFormat = require('mongoose-date-format');
var orderDetailsSchema=new mongoose.Schema({
	items:[],
	address:{
		
		fullName : String,
		number : String,
		email : String,
		address : String,
		city : String,
		district : String,
		zipCode : String,
		accno:Number,
	accholdname:String,
	ifsc:String
	},
	orderId:String,
	totalPrice:String,
    payType:String,
    status:String,
    userId:String,
    orderDate: String
	
});
orderDetailsSchema.plugin(mongooseDateFormat);

module.exports=mongoose.model("OrderDetails",orderDetailsSchema);