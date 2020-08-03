var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
// var middleware=require("../middleware");



//root route
router.get("/",function(req,res){
	//res.send("this will be the landing page..")
	res.render("landing");
});

//---------------AUTH ROUTES_______

router.get("/register", function(req,res){
	res.render("register");
});

router.post("/register", function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser, req.body.password,function(err,user){
		if(err){
			console.log(err);
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res, function(){
			req.flash("success","Welcome to YelpCamp "+ user.username + " !");
			res.redirect("/campgrounds");
		});
	});
});


//show login foem
router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",
{
	successFlash: "Welcome to YelpCamp ",//+ user.username + " !",	
	successRedirect:"/campgrounds",
	failureRedirect:"/login",
	failureFlash:  'Invalid username or password.' ,

}) ,function(req,res,err){
});

//logout route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds");
});

// middleware
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
	
// }
module.exports=router;