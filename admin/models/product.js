var mongoose=require("mongoose");
var productSchema=new mongoose.Schema({
	productCategoryId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"ProductCategory"
	}],
	productName:String,
	productDescription:String,
	productPrice:Number,
	productDiscount:Number,
	 productImage:[String],
	productCategory:String
});

module.exports=mongoose.model("Product",productSchema);