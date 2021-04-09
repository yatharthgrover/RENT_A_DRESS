var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
	
	orders:[{item:[],
		            orderDate:String,
		            orderId:String,
		            totalPrice:String,
		            status:String
		        }],



	
	email:String,
	fname:String,
	lname:String,
	number:String,
	

	address:[{
		fullName : String,
		number : String,
		email : String,
		address : String,
		city : String,
		district : String,
		zipCode : String
	}],



	username:String,
	password:String,
	image:String,
	
	
	cart:[{id:String,title:String,image:String,qty:Number,price:Number,color:String,size:String}],
	totalQty:Number,
	totalPrice:Number
});

userSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("clientUser",userSchema);