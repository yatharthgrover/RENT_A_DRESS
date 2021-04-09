var mongoose=require("mongoose");
var citySchema=new mongooose.Schema({
	cityName:String,
	
});

module.exports=mongoose.model("City",citySchema);