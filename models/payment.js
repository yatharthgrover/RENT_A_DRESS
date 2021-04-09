var mongoose=require("mongoose");
var paymentSchema=new mongooose.Schema({
	orderId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Order"
	}],
	modeOfPayment:String,
	status:String,
	amount:Number,
	userId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="User"
	}]
	
});

module.exports=mongoose.model("Payment",paymentSchema);