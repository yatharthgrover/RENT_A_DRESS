var mongoose=require("mongoose");
var stateSchema=new mongooose.Schema({
	stateName:String
});

module.exports=mongoose.model("State",stateSchema);