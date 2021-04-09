var mongoose=require("mongoose");
var addresSchema=new mongoose.Schema({
	address1:String,
	address2:String,
	zipCode:String,
	mobileNumber:Number,
	cityId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"City"
	}],
	userId:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	}],
	
});
module.exports=mongoose.model("Address",campgroundschema);