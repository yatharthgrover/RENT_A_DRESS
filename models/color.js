var mongoose=require("mongoose");
var colorSchema=new mongooose.Schema({
	colorNameCode:String
});

module.exports=mongoose.model("Color",colorSchema);