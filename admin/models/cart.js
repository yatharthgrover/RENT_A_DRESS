var mongoose=require("mongoose");



var cartSchema= new mongoose.Schema({
	productDetailsId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Productdetail"
	}],
	userId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	}],
	quantity:Number
});
module.exports=mongoose.model("Cart",cartSchema);