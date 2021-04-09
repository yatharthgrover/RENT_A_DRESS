var mongoose=require("mongoose");
var wishlistSchema=new mongooose.Schema({
	userId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="User"
	}],
	productId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Product"
	}]
	
});

module.exports=mongoose.model("Wishlist",wishlistSchema);