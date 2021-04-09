const express=require("express");

const app=express(); //class nd object

app.set('view engine','ejs');

app.use("/css",express.static('css'));
app.use("/fonts",express.static('fonts'));
app.use("/images",express.static('images'));
app.use("/js",express.static('js'));
app.use("/vendor",express.static('vendor'));
app.use("/media",express.static('media'));

app.get("/index",function(req,res){
	res.render("index.ejs");
});
app.get("/addCategory",function(req,res){
	res.render("addCategory.ejs");
});
app.get("/addProduct",function(req,res){
	res.render("addProduct.ejs");
});
app.get("/demo",function(req,res){
	res.render("demo.ejs");
});
app.get("/manageCategory",function(req,res){
	res.render("manageCategory.ejs");
});
app.get("/manageDiscount",function(req,res){
	res.render("manageDiscount.ejs");
});
app.get("/manageOrders",function(req,res){
	res.render("manageOrders.ejs");
});
app.get("/manageProduct",function(req,res){
	res.render("manageProduct.ejs");
});
app.get("/manageServiceArea",function(req,res){
	res.render("manageServiceArea.ejs");
});
app.get("/header",function(req,res){
	res.render("header.ejs");
});
app.get("/login",function(req,res){
	res.render("login.ejs");
});
app.listen(3000,function(req,res){
	console.log("Server running 5000");
});//to create server