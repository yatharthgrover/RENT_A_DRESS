var mongoose=require("mongoose");
var sizeSchema=new mongooose.Schema({
	sizeName:String
});

module.exports=mongoose.model("Size",sizeSchema);