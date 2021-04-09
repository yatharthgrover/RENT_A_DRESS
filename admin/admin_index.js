var express                   =require("express"),
    path                      =require("path"),
	mongoose                  =require("mongoose"),
	bodyparser                =require("body-parser"),
	newProduct                =require("./models/newProduct"),
	multer                    =require("multer"),
	passport                  =require("passport"),
	localstrategy             =require("passport-local"),
	passportlocalmongoose     =require("passport-local-mongoose"),
	expresssession            =require("express-session"),
	User                      =require("./models/user"),
	Category                  =require("./models/category"),
	methodoverride            =require("method-override"),
	mongoStore                =require("connect-mongo")(expresssession),
	cookieParser              =require("cookie-parser"),
	flash                     =require("connect-flash"),
	Color                     =require("./models/color"),
 OrderDetails               =require("./models/orderdetails"),
  clientUser                         =require("./models/clientUser"),



	app                       =express();
// =========mongodb setup====///
console.log("welcome buddy");
mongoose.connect("mongodb://localhost:27017/AAdmin",{useNewUrlParser:true,useUnifiedTopology:true});
//=======================//

//============express  app setup===================//
 
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));
app.use(flash());
app.use(cookieParser());
app.use(methodoverride("_method"));
//==========================================//
//=====image upload setup============================//
var storage=multer.diskStorage({
	destination:"./public/images/product",
	filename:function(req,file,cb){
		cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
	}
});
var upload=multer({
	storage:storage
});

var storage=multer.diskStorage({
	destination:"./public/images/category",
	filename:function(req,file,cb){
		cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname));
	}
});
var categoryUpload=multer({
	storage:storage
});

//=====uploading image function endinggg====//


//===================authentication setup pasport=======================//
 
app.use(expresssession({
			secret:"the kitkat is luckiest one",
			resave:false,
			saveUninitialized:false,

		    store:new mongoStore({mongooseConnection:mongoose.connection}),
	        cookie:{maxAge:24*60*60*1000}
    })
			);
 
  app.use(passport.initialize()); 
  app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localstrategy(User.authenticate()));
//============




//======================================================================//
//===loggedin checking function====================//
   function isLoggedIn(req,res,next){
	    if(req.isAuthenticated())
	    {
			   return next();
	    }
	    else res.redirect("login");
   }
//===============================================//
//========function that gives me current user======//

app.use(function(req,res,next){
	res.locals.currentUser=req.user;

	//console.log("currentUser"+req.user);

	next();
});

//====================sign up routes=====================//
app.get("/signUp",function(req,res){
	res.render("signup");
});
app.post("/signUp" ,upload.single("image"),function(req,res){
	//console.log(req.file);
	User.register({username:req.body.username,image:req.file.path},req.body.password,function(err){
		if(err) return res.render("signup");
		passport.authenticate("local")(req,res,function(){
			res.redirect("/index");
		})
	})
})
//===============================================================//
//==================login check=================================//
app.get("/login",function(req,res){
	res.render("login");
});
app.post("/login",passport.authenticate("local",{
	successRedirect:"/index",
	failureRedirect:"/login"
}),function(req,res){});

//=====log out===//
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/index");
});
//============================================================//


//=======add product get and post=======================================================//
app.get("/addProduct", isLoggedIn,function(req,res){
	var message=req.flash("added");
	Category.find({},function(err,category){
		if(err) res.redirect("/index");
		else res.render("addProduct",{category:category,message:message});
	})
	
});


	app.post("/addProduct/post",isLoggedIn,upload.any(),function(req,res){
            
		
		   //console.log(req.body.);
		   var subcategory=[];
		   var tyype=typeof req.body.subCategory;
		   if(tyype!=="string"){
		        req.body.subCategory.forEach(function(subcat){
		        	subcategory.push(subcat);
		        });
		    }else{
		    	subcategory.push(req.body.subCategory);
		    }
                                newProduct.create({
                              	name:req.body.productName,
                              	description:req.body.description,
                              	category:req.body.category,
                              	subCategory:subcategory,
                              	totalQuantity:0
                              	
                              	
                              },function(err,created){
                              	if(err) console.log(err);
                              	else {console.log(created);
                              		   var k=1;
                              		for(var i=0;i>=0;i+=6){
                   					
                                    var x="field"+i;
                         
                                   console.log("field checking",x);
                          if(req.body[x]==undefined)
                         	break;
                           else{
                              var size=   req.body["field"+i];
                              var color=  req.body["field"+(i+1)];
                              var price=  parseInt(req.body["field"+(i+2)],10);
                              var stock= parseInt(req.body["field"+(i+3)],10);

                              created.totalQuantity+=stock;
                              var Return= req.body["field"+(i+4)];

                              var replace=req.body["field"+(i+5)];
                               console.log(size);
                               console.log(replace);
                              var product={};

                              product.color=color;
                              product.price=price;
                              product.stock=stock;
                              product.Return=Return;
                              product.replace=replace;
                              product.image=[];
                              

                            //image insert
                              
                              var images=req.files;
                              for(var j=0;j<images.length;j++)
                              {   
                                   var imageName=images[j].fieldname;
                                   var oldname="img"+k+k;

                                   if(oldname==imageName)
                                   {
                                   	product.image.push(images[j].path);
                                   }
                              }
                              k++;

                                    var arr=product;
                                    
                                    created[size].push(arr);

                                  created.save(function(err,saved){
                              	console.log(saved);
                              });
                                

                       }
               }req.flash("added","Product added successfully");

           }
         res.redirect("/addProduct");  
     
	 });
                    });

//=============================update product=========================//
app.put("/update",upload.any(),function(req,res){
	 console.log("images==>> ",req.files);
 //     newProduct.findByIdAndRemove(req.query.id, req.body, function(err, post) {
 //    if (err) return next(err);
   
 // });
    
     var subcategory=[];
		   var tyype=typeof req.body.subCategory;
		   if(tyype!=="string"){
		        req.body.subCategory.forEach(function(subcat){
		        	subcategory.push(subcat);
		        });
		    }else{
		    	subcategory.push(req.body.subCategory);
		    }
                                newProduct.create({
                              	name:req.body.productName,
                              	description:req.body.description,
                              	category:req.body.category,
                              	subCategory:subcategory,
                              	totalQuantity:0
                              	
                              	
                              },function(err,created){
                              	if(err) console.log(err);
                              	else {console.log(created);
                              		   var k=1;
                              		   var z=101;
                              		   var flag=false;
                              		   var l=1;

                              		for(var i=0;i>=0;i+=6){
                   					
                                    var x="field"+i;
                         
                                   console.log("field checking",x);
                          if(req.body[x]==undefined)
                         	break;
                           else{
                              var size=   req.body["field"+i];
                              var color=  req.body["field"+(i+1)];
                              var price=  parseInt(req.body["field"+(i+2)],10);
                              var stock= parseInt(req.body["field"+(i+3)],10);

                              created.totalQuantity+=stock;
                              var Return= req.body["field"+(i+4)];

                              var replace=req.body["field"+(i+5)];
                               console.log(size);
                               console.log(replace);
                              var product={};

                              product.color=color;
                              product.price=price;
                              product.stock=stock;
                              product.Return=Return;
                              product.replace=replace;
                              product.image=[];
                              

                            //image insert

                              product.image.push(req.body.old0);
                              product.image.push(req.body.old1);
                              var images=req.files;
                              for(var j=0;j<images.length;j++)
                              {   
                                   var imageName=images[j].fieldname;
                                   var oldname="img"+k+z;
                                    
                                   if(oldname==imageName)
                                   {
                                   	product.image.push(images[j].path);
                                   }else{
                                       console.log("newimage 11 22 33");
                                   	var newName="img"+l+l;
                                   	if(newName==imageName){
                                   		
                                   		product.image.push(images[j].path);
                                   		flag=true;
                                   	}
                                   }
                                   k++;

                              }
                               if(flag) {l++;}
                              z++;

                                    var arr=product;
                                    
                                    created[size].push(arr);

                                  created.save(function(err,saved){
                              	console.log(saved);
                              });
                                req.flash("added","Product added successfully");

                       }
               }

           }
         res.redirect("/addProduct");  
     
	 });
});







	//==================add  category============================//


	app.get("/addCategory",isLoggedIn,function(req,res){
                     var message=req.flash("info")
	res.render("addCategory",{message:message});
});
	
	app.post("/addCategory",isLoggedIn,categoryUpload.single("image"),function(req,res){

           var name=req.body.categoryName;
           var image=req.file.path;
           var subcategory=[];
           for(var i=0;i>=0;i++)
             {  
                 var sub="field"+i;
               console.log(sub);
               console.log(req.body[sub]);
               if(req.body[sub]===undefined) break;
               else subcategory.push(req.body[sub]);
             }

           Category.create({
           	   categoryName:name,
           	   categoryImage:image,
           	   subCategory:subcategory
           },function(err,created){
           	if(err) console.log(err);
           	else{
           		 console.log(created);
           		 req.flash("info","your category is added successfully");
            
           }
              res.redirect("/addCategory");

           });
	});





//=================edit category=======update operation===========//

app.get("/editCategory",isLoggedIn,function(req,res){
	var id=req.query.id;
	
	Category.findById(id,function(err,category){
		if(err) res.redirect("/index");
		else res.render("editCategory",{category:category});
	})
});

	app.post("/editCategory/post",isLoggedIn,upload.any(),function(req,res){
            var id=req.query.id;
		
		   //console.log(req.body.);
		  
         res.redirect("/manageCategory");  
     
	 });
          
//==============edit category end here=============================//



//=========================================delete category =============================//

app.get("/deleteCategory",isLoggedIn,function(req,res){
	var id=req.query.id;
	var flag = 0;
	Category.findById(id,function(err,category){
		var cname=category.categoryName;
		if(err) res.redirect("/index");

		else{
			newProduct.find({},function(err,product){
				product.forEach(function(productname){
					if(productname.category==category.categoryName)	{
						flag=1;						
					}
				});
				if(flag==1)
					Category.find({},function(err,found){
						if(err) res.redirect("/index");
						else res.render("manageCategory",{Product:found,message:"Can't Delete..!! Product Exists..."});
					});
				else
				{
					category.delete();
					Category.find({},function(err,found){
						if(err) res.redirect("/index");
						else res.render("manageCategory",{Product:found,message:"Deleted"});
					});
				}

			})
		}
	})
});

//====================================delete category end here=============================//


	
//***************************************************************/
//=====manage product====printing product on manage product page=============//
app.get("/manageCategory",isLoggedIn,function(req,res){
	
	
	Category.find({},function(err,found){
		if(err) console.log("nnot found");
		else res.render("manageCategory",{Product:found,message:""});
	})
	
	
	//res.render("manageProduct");
});
app.get("/manageProduct",isLoggedIn,function(req,res){
    newProduct.find({},function(err,Products){


    	if(err) res.render("index");
    	else{
    		res.render("manageProduct",{Products:Products});
    	}
    });


	
});


//=================edit products=======update operation===========//
app.get("/editProduct",isLoggedIn,function(req,res){
	var id=req.query.id;
	

	newProduct.findById(id,function(err,product){
		if(err) res.redirect("/");
		else{
		//Edited for Category
			Category.find({},function(err,category){
				if(err) res.redirect("/index");
				else res.render("editProduct",{category:category,product:product});
			})
			//End Edited for Category
			//res.render("editProduct",{category:category,product:product});
		}

	})
	
});

	app.post("/editProduct/post",isLoggedIn,upload.any(),function(req,res){
            var id=req.query.id;
		
		   //console.log(req.body.);
		  
         res.redirect("/manageProduct");  
     
	 });
          

//==============edit product end here=============================//

//=============================================delete Product==============================//
app.get("/deleteProduct",isLoggedIn,function(req,res){
	var id=req.query.id;
	
	newProduct.findById(id,function(err,product){
		if(err) res.redirect("/");
		else{
			product.delete();
			res.redirect("/manageProduct");
		}

	})
});

//=========================================end delete Product==============================//
app.get("/manageColors",isLoggedIn,function(req,res){
	
	Color.find({},function(err,found){
          if(err) res.redirect("/");
          else 
          res.render("manageColors",{colors:found});
	})
	
});



  app.post("/addColor",function(req,res){
  	var color=req.body.colorName;
  	Color.create({
  		colorName:color
  	},function(err,created){
  		console.log(created);
  		req.flash("color","color added successfully");
  		res.redirect("/manageColors");
  	});
  	
  });

//==========================home page route===========================//
app.get("/",isLoggedIn,function(req,res){
	res.redirect("/index")
});
app.get("/index",isLoggedIn,function(req,res){
	res.render("index");
});
//==================================end home page=========================//
app.get("/AcceptOrder",function(req,res){
  var userId=req.query.userId;
  var orderId=req.query.orderId;
  var id=req.query.Id;
  OrderDetails.findById(id,function(err,found){
      if(err) res.redirect("/");
      else{
        found.status="accepted";
        found.save(function(err,saved){console.log(saved);});
      }
     });

  clientUser.findById(userId,function(err,found){
    if(err) console.log("error",err);
    else{
      console.log("client user",found);
      found.orders.forEach(function(item){
      if(item.orderId==orderId){
        item.status="accepted";
        found.save(function(err,saved){console.log(saved);});
        res.redirect("/manageOrders");
        return false;
      }
    })}
    
  })
  
});
app.get("/RejectOrder",function(req,res){
  var userId=req.query.userId;
  var orderId=req.query.orderId;
  var id=req.query.Id;
     OrderDetails.findByIdAndRemove(id,function(err,removed){
      if(err) res.redirect("/");
      else{
        console.log(removed);
      }
     });


  clientUser.findById(userId,function(err,found){
    if(err) console.log("error",err);
    else{
         



      console.log("client user",found);
      found.orders.forEach(function(item){
      if(item.orderId==orderId){
        item.status="Rejected";
        found.save(function(err,saved){console.log(saved);});
        res.redirect("/manageOrders");
        return false;
      }
    })}
    
  })
  
});




app.get("/demo",function(req,res){
	res.render("demo.ejs");
});
app.get("/manageDiscount",isLoggedIn,function(req,res){
	res.render("manageDiscount.ejs");
});
app.get("/manageOrders",isLoggedIn,function(req,res){

  OrderDetails.find({},function(err,orders){
    if(err) res.redirect("/");
    else{
         res.render("manageOrders",{orders:orders});
    }
  })
	
});

app.get("/manageServiceArea",isLoggedIn,function(req,res){
	res.render("manageServiceArea.ejs");
});


app.get("/header",isLoggedIn,function(req,res){
	res.render("header.ejs");
});

app.get("/signUp",function(req,res){
	res.render("signup");
});




app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("server has started");
});
                                           
//

// 1. Products-->{s,m,l,xl,xxl}
//   ---s 
//   	 -red--image[0],green--image[0]
//    ---m 
//    	 -red,green

//  2. Products
//   ---s 
//   	 -red,green
//    ---m 
//    	 -red,green
//size=["S","M","X","L"]
// for(i=0;i<size.size()){
		//var sized=size[i];
// 	for(i=0;i<product.size();i++){
		// if(product[i].sized[0]==undefined)
		// 	continue;
		// else
// 		display(product[i].[sized][0].image[0])
// 	}
// }





