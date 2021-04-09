var mongoose=require("mongoose");
var productDetailsSchema=new mongooose.Schema({
	productId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Product"
	}],
	productSizeId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Size"
	}],
	productColorId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref="Color"
	}],
	productStock:Number
});

module.exports=mongoose.model("ProductDetails",productDetailsSchema);