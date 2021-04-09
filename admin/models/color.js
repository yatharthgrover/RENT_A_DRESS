var mongoose=require("mongoose");
var colorSchema=new mongoose.Schema({
	colorName:String
});

module.exports=mongoose.model("Color",colorSchema);