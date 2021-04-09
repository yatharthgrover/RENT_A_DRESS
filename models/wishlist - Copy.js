var mongoose=require("mongoose");
var earnSchema=new mongoose.Schema({


	
	name:String,
	shopname:String,
	shopno:Number,
	address:String,
	city:String,
	zipcode:Number,
	gstin:String,
	phone:String,
	email:Number	
	
});
module.exports=mongoose.model("earn",earnSchema);