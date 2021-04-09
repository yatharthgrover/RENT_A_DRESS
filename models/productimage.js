var mongoose=require("mongoose");
var productImageSchema=new mongooose.Schema({
	productId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Product"
	}],
	imageUrl:String
});

module.exports=mongoose.model("ProductImage",productImageSchema);