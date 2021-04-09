var mongoose=require("mongoose");
var categorySchema=new mongoose.Schema({
	categoryName: String,
	categoryImage:String,
	subCategory :[String]
});

module.exports=mongoose.model("Category",categorySchema);
