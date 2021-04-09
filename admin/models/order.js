var mongoose=require("mongoose");
var orderSchema=new mongooose.Schema({
	addressId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Address"
	}],
	finalAmount:Number,
	dateOfOrder:Date,
	trackingNumber:Number
});

module.exports=mongoose.model("Order",orderSchema);