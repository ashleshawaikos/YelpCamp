var express=require("express"),
	app=express(),
	bodyParser=require("body-parser"),
	mongoose =require("mongoose"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	methodOverride=require("method-override"),
	flash=require("connect-flash"),
	Campground=require("./models/campground"),
	Comment=require("./models/comment"),
	User=require("./models/user"),
	seedDB=require("./seeds");

var commentRoutes=require("./routes/comments");
var campgroundRoutes=require("./routes/campgrounds");
var indexRoutes=require("./routes/index");
// console.log(process.env.DATABASEURL);

// mongooseconnection
mongoose.connect(process.env.DATABASEURL,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})	.then(() => console.log('Connected to DB!'))
	.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORRT config
app.use(require("express-session")({
	secret: "Once again, Rusty wins the cutest dog!",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

