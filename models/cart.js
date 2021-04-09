var mongoose=require("mongoose");



var cartSchema= new mongoose.Schema({
	item:{      id:String,
		         title:String,
	            image:String,
	            price:Number,
	            qty   :Number,
		        size   :String,
		        color : String
		    },
	
    totalQty:Number,
	totalPrice:Number
});
module.exports=mongoose.model("Cart",cartSchema);