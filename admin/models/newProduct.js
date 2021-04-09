var mongoose  =require("mongoose");

var Schema  =mongoose.Schema;
var productSchema=new Schema({

   name:String,
   category:String,
   subCategory:[String],
   description:String,
     S:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],
   
   	 M:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],

     L:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],
    
     XL:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],

      XXL:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],
    
     _3XL:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],
          _4XL:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],

     _5XL:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],


     freeSize:[{color:String,stock:Number,price:Number,image:[String],Return:String,replace:String}],

     totalQuantity:Number,


     // allProducts:{s:[{id,name,image[0],price}],m:[{id,},l:[{id,name,}]}




});
module.exports=mongoose.model("newProduct",productSchema);
