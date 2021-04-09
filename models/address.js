var mongoose=require("mongoose");
var addresSchema=new mongoose.Schema({

		fname:String,
		lname:String,
		email:String,
		number:Number,
		country:String,
		district:String,
		zipcode:Number,
		company:String,
		address1:String,
		address2:String,
		town:String,
		accno:Number,
	accholdname:String,
	ifsc:String
	
	
});
module.exports=mongoose.model("Address",addresSchema);