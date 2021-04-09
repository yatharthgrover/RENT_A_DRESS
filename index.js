var express                            =require("express"),
    path                               =require("path"),
	bodyparser                         =require("body-parser"),
	mongoose                           =require("mongoose"),
	passport                           =require("passport"),
	localstrategy                      =require("passport-local"),
	passportlocalmongoose              =require("passport-local-mongoose"),
	session                            =require("express-session"),
    clientUser                         =require("./models/clientUser"),
	Address                            =require("./models/address"),
    Cart                               =require("./models/cart"),
	multer                             =require("multer"),
	methodoverride                     =require("method-override"),
	flash                              =require("connect-flash"),
	validator                          =require("express-validator"),
	mongoStore                         =require("connect-mongo")(session),
	cookieParser                       =require("cookie-parser"),
	crypto 							   = require('crypto'),
	newProduct                         =require("./models/clientnewProduct"),
	OrderDetails                         =require("./models/orderdetails"),
	Category                  	       =require("./models/category"),
    dateFormat                         = require('date-format'),
    app                                =express();
		
//====using same database that already has admin data=============================//
mongoose.connect("mongodb://localhost:27017/AAdmin",{useNewUrlParser:true,useUnifiedTopology:true});
//=======================connnected...!!!!!====================//

//=============app use basic express set up settings =================//
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join("admin")));

app.use(methodoverride("_method"));
//==============end express set up====================================//

//===============authentication set up===============================//
app.use(cookieParser());
app.use(flash());
app.use(session({
	secret:"kitkat is awesome",
	resave:false,
	saveUninitialized:false,
	store:new mongoStore({mongooseConnection:mongoose.connection}),
	cookie:{maxAge:24*60*60*1000}
	
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(clientUser.serializeUser());
passport.deserializeUser(clientUser.deserializeUser());
passport.use(new localstrategy(clientUser.authenticate()));

//======================authentication set up completed=============//


//=================image upload set up=============================//
var storage=multer.diskStorage({
	destination:"./public/images",
	filename:function(req,file,cb){
		cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
	}
});
var upload=multer({
	storage:storage
});
//===============image upload set up completed=====================//

//============function which stores current user================//

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	
	next();
});
//==================end....of function==========================//

//=================function for checking. is logged in?===========//
function isLoggedIn(req,res,next){
	    if(req.isAuthenticated())
	    {
			   return next();
	    }
	    else res.redirect("login");
   }
//========================end===================================//

//================sign up routes==============================//
app.get("/signup",function(req,res){
	var message=req.flash("exists");
	res.render("signup",{message:message});
});
app.post("/signup",upload.single("image"),function(req,res){
	
      clientUser.findOne({username:req.body.username},function(err,found){
      	if(found){

      		req.flash("exists","username already exists");
      		res.redirect("/signup");
      	}else{


           clientUser.register({
			fname:req.body.fname,
		    lname:req.body.lname,
			email:req.body.email,
			number:req.body.number,
			//address:req.body.address,
			username:req.body.username,
			image:req.file.path
		},req.body.password,function(err){
			if(err) return console.log(err);
			passport.authenticate("local")(req,res,function(){
				res.redirect("/index");
			});
		});


      }
     })

	
});
//============================sign up route complete===================//
	
//==============login=========route=================================//
	app.get("/login",function(req,res){
		//console.log(req.flash("error"));
	res.render("login",{message:req.flash("error")});
});
	
	app.post("/login",passport.authenticate("local",{
		successRedirect:"/index",
		failureRedirect:"/login",
		failureFlash: 'Invalid username or password.'
		
	}),function(req,res){});


//============login end==================================//
//=====================log out==========================//
	app.get("/logout",function(req,res){
		req.logout();
		res.redirect("/index");
	});
//=================log out end=============================//

//==========================single page section option of add cart===============//
var sizeProduct="S";
var colorProduct;
app.get("/singleProduct",function(req,res){
	 var id=req.query.id;
	 sizeProduct=req.query.size;
	 colorProduct= req.query.color;
  newProduct.findById(id,function(err,found){
       
   	 console.log(found);
   	 
   	 if (colorProduct===undefined) {colorProduct= found[sizeProduct][0].color;}
   	 console.log(colorProduct);
   	 
   	res.render("single-product",{product:found,sizeProduct:sizeProduct,colorProduct:colorProduct});
  
   })


})



// app.post("/singleProduct/post",function(req,res){
// 	sizeProduct=req.body.size;
// 	colorProduct=req.body.color;


// })

 
	//======routing category and updating all product in that category==========//
app.get("/category",function(req,res){
	var message=req.flash("info");
	newProduct.find({},function(err,found){
		if(err) console.log(err);
		else{
			Category.find({},function(err,category){
				if(err) console.log(err);
				else res.render("category",{Product:found,message:message,category:category});
			})
		} 
	});
	
	
	
});
//=================products page render======================//
  


app.get("/cartitem",isLoggedIn,function(req,res){
	
	  
		  	var cart=req.user.cart;
	       res.render("cart",{product:cart});
	

	  });	
//========================end route og single product=============================//

//====================adding item to cart ,cart route============================//
app.get("/cart/:id/:SIZE/:color",function(req,res){
	   var productId=req.params.id;
	    var Csize=req.params.SIZE;
	    var Ccolor=req.params.color;
	newProduct.findById(productId,function(err,product){
		if(err) res.redirect("/category");
		else{
			  var newitem=true;
			  var cart=req.user.cart;
			for(var i=0;i<cart.length;i++)
				{
					if(cart[i].id==product._id&&cart[i].color==Ccolor&&cart[i].size==Csize)
						{

							cart[i].qty++;
							if(req.user.totalPrice)
							req.user.totalPrice+=cart[i].price;
							else req.user.totalPrice=cart[i].price;
							req.user.save(function(err,saved){
								if(err) console.log(err);
								else console.log(saved);
							})
							newitem=false;
							break;
						}
				}
				if(newitem){
					var item={};
					item.id=productId;
					item.price=product[Csize][0].price;
					item.qty=1;
					item.title=product.name;
					item.color=Ccolor;
					item.size=Csize;
					item.image=product[Csize][0].image[0];
					if(req.user.totalPrice)
					req.user.totalPrice+=product[Csize][0].price;
					else req.user.totalPrice=product[Csize][0].price;

					req.user.cart.push(item);
					req.user.save(function(err,saved){
						if(err) console.log(err);
						else console.log(saved);
					});
				}
				
		    }
				
				
				
				req.flash("info","item added to cart succesfully");
			res.redirect("/category");	
	
	});

	
});
	
//=======add itemm to car from single product item	======//
app.post("/addToCart/singleProduct/:color/:size/:id",function(req,res){

	
	// if(!isLoggedIn) res.redirect("/login");
    var Sqty=parseInt(req.body.qty);
    var Scolor=req.params.color;
    var Ssize=req.params.size;
    var Sid=req.params.id;


newProduct.findById(Sid,function(err,product){
		if(err) res.redirect("/category");
		else{
			  var newitem=true;
			  var cart=req.user.cart;
			for(var i=0;i<cart.length;i++)
				{
					if(cart[i].id==product._id&&cart[i].color==Scolor&&cart[i].size==Ssize)
						{
							cart[i].qty+=Sqty;
							if(req.user.totalPrice)
							req.user.totalPrice+=cart[i].price*Sqty;
							else req.user.totalPrice=cart[i].price;
							req.user.save(function(err,saved){
								if(err) console.log(err);
								else console.log(saved);
							})
							newitem=false;
							break;
						}
				}
				if(newitem){
					var item={};
					item.id=Sid;

                    const element= product[Ssize].find(elements =>{
                    	if(elements.color==Scolor)
                    		return elements;
                    });
                    console.log(element);
					item.price=element.price;
					item.qty=Sqty;
					item.title=product.name;
					item.color=Scolor;
					item.size=Ssize;
					item.image=element.image[0];
					if(req.user.totalPrice)
					req.user.totalPrice+=element.price*Sqty;
					else req.user.totalPrice=element.price;

					req.user.cart.push(item);
					req.user.save(function(err,saved){
						if(err) console.log(err);
						else console.log(saved);
					});
				}
				
		    }
				
				
				
				req.flash("info","Item added to cart succesfully");
			res.redirect("/category");	
	
	});






})
	

//================cart action add qtty and decrease qtty===========//
app.get("/cartaction/:id/:action/:size/:color",function(req,res){
     var color=req.params.color;
     var size=req.params.size;
	var action=req.params.action;
	var id=req.params.id;
	
	
	var cart=req.user.cart;
	if(action=="+")
		{
			var foundProduct=[];
			for(var i=0;i<cart.length;i++){
					if(cart[i].id==id&&cart[i].size==size&&cart[i].color==color)
					{  
                        newProduct.findById(id,function(err,found){
                        	
                            if(err) res.redirect("/");
                        	else{foundProduct=found[size];
                               console.log("found product",foundProduct);
                         for(var j=0;j<foundProduct.length;j++){
                         	console.log("Inside loop");
                         	if(foundProduct[j].color==color){
                         		console.log("Inside 1st if");
                         		if(foundProduct[j].stock>cart[i].qty){
                         			cart[i].qty++;
                         			req.user.totalPrice+=cart[i].price;
									req.user.save();
									res.redirect("/cartitem");
                         			break;
                         		}
                         		else
                         			res.redirect("/cartitem");
                         		}
                         		
                         	}
                         


                        	}




                        	
                        });
                        

						
						
						break;
					}
				}
				
			
		}
	else if(action=="-"){
		for(var i=0;i<cart.length;i++){
					if(cart[i].id==id&&cart[i].size==size&&cart[i].color==color)
					{   if(cart[i].qty>0){
						cart[i].qty--;
						req.user.totalPrice-=cart[i].price;
						req.user.save();}
						break;
					}
				}
		res.redirect("/cartitem");
	}else if(action=="delete"){
		
		for(var i=0;i<cart.length;i++){
					if(cart[i].id==id&&cart[i].size==size&&cart[i].color==color)
					{    newProduct.findById(id,function(err,product){
						
					    req.user.totalPrice-=cart[i].qty*cart[i].price;
						cart.splice(i,1);
						req.user.save();
					     });//
						
						
						break;
					}
				}
				res.redirect("/cartitem");
	}
});
		
			


//=======================add item to the cart populatin object========//


	    
		//res.render("cart",{exec:req.user.cartItem});
			
	
	
//});
// Cart.find(function(err,find){
// 	console.log(find);
// })
// Cart.find().populate("productId").exec(function(err,cart){
// 		if(err) console.log(err);
// 		else{console.log(cart);
// 		}});


// Cart.find().populate("productId").exec(function(err,cart){
// 		if(err) console.log(err);
// 		else{cart.forEach(function(cart){
// 			console.log(cart.productId.productName);
// 		});}});



		
	  
		
	


//=================removing cart item=========================//

app.get("/checkout",function(req,res){
   //       var cart=req.user.cart;
		 //   var order=cart.filter(function(item){
		 //   	return item.qty!==0;
		 //   }
		 //   	);


   //    var orderedItem={};
			// var orderId="x90900090";
			// var now = new Date();
   //          dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
   //          orderedItem.orderId=orderId;
   //          orderedItem.item=order;
   //          orderedItem.orderDate=now;
   //          orderedItem.totalPrice=req.user.totalPrice;
   //          orderedItem.status="Pending";

   //         req.user.orders.push(orderedItem);
   //     req.user.cart.forEach(function(item){

   //          newProduct.findById(item.id,function(err,found){
   //          	if(err) res.redirect("/index");
   //          	else{
   //          		found[item.size].forEach(function(itm){
   //          			if(itm.color==item.color){
   //          				itm.stock-=item.qty;
   //          				found.totalQuantity-=item.qty;
   //          			}
            			
   //          		})
   //          		found.save(function(err,saved){
   //          				console.log(saved);
   //          			});
   //          	}
   //          });

   //        });


   //   var cart=cart.filter(function(item){
		 //   	return item.qty==0;
		 //   }
		 //   	);
		 //   req.user.totalPrice=0;
		 //   req.user.cart=cart;
		 //   req.user.save();
		 //   console.log("deleted cart",req.user);



       

     
     	var message=req.flash("error");
     
	res.render("checkout",{cartItem:req.user.cart,address:req.user.address,totalPrice:req.user.totalPrice,message:message});
});

//==================checking out route============================//
//==============payment==========================//
app.get("/payment/addAddress",function(req,res){

  if(req.user.address.length==0)
	req.flash("error","please add the address");
  res.redirect("/checkout");
});


	//===============add address to user=========//
app.post("/addAddress",function(req,res){
	 var address={};
	 address.fullName=req.body.fullName;
	 address.email=req.body.email;
	 address.address=req.body.address;
	 address.district=req.body.district;
	 address.number=req.body.number;
	 address.zipCode=req.body.zipCode;
	 address.city=req.body.city;
	 address.accno=req.body.accno;
	 address.accholdname=req.body.accholdname;
	 address.ifsc=req.body.ifsc;
	




	 req.user.address.push(address);
	    req.user.save(function(err,address){
	 	if(err) console.log(err);
	 	else {
	 		console.log(address);
	 		
           }
res.redirect("/checkout")
	 })
	 
   

	});
	
	// req.user.address.push(req.body.address);
	// req.user.save(function(err,saved){
	// 	if(err) console.log(err);
	// 	else console.log(saved);
	// });
//===============Payment=========//
app.post("/payment/add",function(req,res){

var addressId=req.body.address;
var cashType=req.body.selector;
var ord = JSON.stringify(Math.random()*1000);
	var i = ord.indexOf('.');
	ord = 'ORD'+ ord.substr(0,i);
if(cashType=="COD"){

var cart=req.user.cart;
		   var order=cart.filter(function(item){
		   	return item.qty!==0;
		   });
		     // var add={};
		     // add.fullName=req.user.address[0].fullName;
		     // add.email=req.user.address[0].email;
		     //  add.address=req.user.address[0].address;
		     //  add.district=req.user.address[0].district;
		     //  add.number=req.user.address[0].number;
		     //  add.zipCode=req.user.address[0].zipCode;
		     //  add.city=req.user.address[0].city;
              

		     
           var now = new Date();
           dateFormat();
           dateFormat(new Date());
            dateFormat("dddd, mmmm dS, yyyy",new Date());
            var address=req.user.address.find(element=> element._id==addressId)
              OrderDetails.create({
             	items:order,
             	address:address,
             	userId:req.user._id,
             	totalPrice:req.user.totalPrice,
             	orderId:ord,
             	orderDate:now,
             	status: "Rejected",
             	payType: "COD"



             },function(err,created){
             	console.log("admin orders created ==>>",created);
             })
           
      var orderedItem={};
			
			
            orderedItem.orderId=ord;
            orderedItem.item=order;
            orderedItem.orderDate=now;
            orderedItem.totalPrice=req.user.totalPrice;
            orderedItem.status="Pending";

           req.user.orders.push(orderedItem);
       req.user.cart.forEach(function(item){

            newProduct.findById(item.id,function(err,found){
            	if(err) res.redirect("/index");
            	else{
            		found[item.size].forEach(function(itm){
            			if(itm.color==item.color){
            				itm.stock-=item.qty;
            				found.totalQuantity-=item.qty;
            			}
            			
            		})
            		found.save(function(err,saved){
            				console.log(saved);
            			});
            	}
            });

          });


     var cart=cart.filter(function(item){
		   	return item.qty==0;
		   }
		   	);
		   req.user.totalPrice=0;
		   req.user.cart=cart;
		   req.user.save().then(res.redirect("/order"));
		   console.log("deleted cart",req.user);


}else{
	res.render("payment", {orderid:ord,addressId:addressId});
}



})
// app.get('/payment', function(req,res) {	
	
// 	res.render("payment", {orderid:ord});
// 	// var message=req.flash("error");	

// 	// res.render("checkout", {orderid:ord,
// 	// 	cartItem:req.user.cart,
// 	// 	address:req.user.address,
// 	// 	totalPrice:req.user.totalPrice,
// 	// 	message:message});
	
// });
	app.post('/payment', function(req, res){
	var strdat = '';
	
	req.on('data', function (chunk) {
        strdat += chunk;
    });
	
	req.on('end', function()
	{
		var data = JSON.parse(strdat);
		var cryp = crypto.createHash('sha512');
		var text = "PQ9A1EG5"+'|'+data.txnid+'|'+data.amount+'|'+data.pinfo+'|'+data.fname+'|'+data.email+'|||||'+data.udf5+'||||||'+"TU8OwOc6zU";
		console.log("text:- ",text);
		cryp.update(text);
		var hash = cryp.digest('hex');		
		res.setHeader("Content-Type", "text/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify(hash));

	});             
	
	
});

app.post('/response.html', function(req, res){
	var key = req.body.key;
	var salt = req.body.salt;
	var txnid = req.body.txnid;
	var amount = req.body.amount;
	var productinfo = req.body.productinfo;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var udf5 = req.body.udf5;
	var mihpayid = req.body.mihpayid;
	var status = req.body.status;
	var resphash = req.body.hash;
	var addressId=req.body.addressId;
	
	var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
	var keyArray 		= 	keyString.split('|');
	var reverseKeyArray	= 	keyArray.reverse();
	var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	
	var cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
	var calchash = cryp.digest('hex');
	
	var msg = 'Payment failed for Hash not verified...';
	if(calchash == resphash)
		msg = 'Transaction Successful and Hash Verified...';
		if(status=="success"){
			console.log("inside success");
			   var cart=req.user.cart;
		   var order=cart.filter(function(item){
		   	return item.qty!==0;
		   });
		     // var add={};
		     // add.fullName=req.user.address[0].fullName;
		     // add.email=req.user.address[0].email;
		     //  add.address=req.user.address[0].address;
		     //  add.district=req.user.address[0].district;
		     //  add.number=req.user.address[0].number;
		     //  add.zipCode=req.user.address[0].zipCode;
		     //  add.city=req.user.address[0].city;
              

		     console.log(txnid);
           var now = new Date();
           dateFormat();
           dateFormat(new Date());
            dateFormat("dddd, mmmm dS, yyyy",new Date());
          var address=req.user.address.find(element=> element._id==addressId);
              OrderDetails.create({
             	items:order,
             	address:address,
             	userId:req.user._id,
             	totalPrice:req.user.totalPrice,
             	orderId:txnid,
             	orderDate:now,
             	status: "Rejected",
             	payType: "Online"


             },function(err,created){
             	console.log("admin orders created ==>>",created);
             })
             // OrderDetails.create({
             // 	items:order,
             // 	address:req.user.address[0],
             // 	userId:req.user._id,
             // 	totalPrice:req.user.totalPrice,
             // 	orderId:txnid,
             // 	orderDate:now
             // 	payType: "Online"

             // },function(err,created){
             // 	console.log("admin orders created ==>>",created);
             // })
      var orderedItem={};
			
			
            orderedItem.orderId=txnid;
            orderedItem.item=order;
            orderedItem.orderDate=now;
            orderedItem.totalPrice=req.user.totalPrice;
            orderedItem.status="Pending";

           req.user.orders.push(orderedItem);
       req.user.cart.forEach(function(item){

            newProduct.findById(item.id,function(err,found){
            	if(err) res.redirect("/index");
            	else{
            		found[item.size].forEach(function(itm){
            			if(itm.color==item.color){
            				itm.stock-=item.qty;
            				found.totalQuantity-=item.qty;
            			}
            			
            		})
            		found.save(function(err,saved){
            				console.log(saved);
            			});
            	}
            });

          });


     var cart=cart.filter(function(item){
		   	return item.qty==0;
		   }
		   	);
		   req.user.totalPrice=0;
		   req.user.cart=cart;
		   req.user.save();
		   console.log("deleted cart",req.user);
		}
	
	res.render('response', {key: key,salt: salt,txnid: txnid,amount: amount, productinfo: productinfo, 
	firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg});
});

//===============End Payment=========//


   app.delete("/order/:ordered",function(req,res){
	   var data=ordered;
	   console.log(JSON.parse(req.params.ordered));
	  console.log(data);
	   
   });


app.get("/order",function(req,res){
     


	res.render("order",{orderedItem:req.user.orders});
}); 

app.get("/profile",function(req,res){
	res.render("profile.ejs");
}); 


app.get("/",function(req,res){
	res.redirect("/index");
});
app.get("/index",function(req,res){
	res.render("index");
});

app.get("/cart1",function(req,res){
	res.render("cart1");
})
app.get("/cart2",function(req,res){
	res.render("cart2");
})



app.get("/about",function(req,res){
	res.render("about.ejs");
});
app.get("/blog",function(req,res){
	res.render("blog.ejs");
});



app.get("/confirmation",function(req,res){
	res.render("confirmation.ejs");
});
app.get("/elements",function(req,res){
	res.render("elements.ejs");
});
app.get("/footer",function(req,res){
	res.render("footer.ejs");
});
app.get("/header",function(req,res){
	res.render("header.ejs");
});


app.get("/single-blog",function(req,res){
	res.render("single-blog.ejs");
});

app.get("/tracking",function(req,res){
	res.render("tracking.ejs");
});
app.get("/contact",function(req,res){
	res.render("contact.ejs");
});
app.get("/earn",function(req,res){
	res.render("earn.ejs");
});




app.get("/singleproduct2",function(req,res){
	res.render("single-product2");
});
app.listen(process.env.PORT||5000,process.env.IP,function(req,res){
	console.log("Server has started...");
});//to create server
