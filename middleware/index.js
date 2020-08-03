var middlewareObj = {};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership=function (req,res,next)
{
	if(req.isAuthenticated()){
		//does the user own the campground
		Campground.findById(req.params.id,function(err, foundCampground)				{
			if(err){
				console.log(err);
				req.flash("error","Campground not found.");
				res.redirect("back");
			}
			else{
				//foundCampground.author.id is a mongoose obj
				//req.user._id is a string
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You dont have the permissions to do that");
					res.redirect("back");
				}	
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in first.")
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership=function(req,res,next){
		if(req.isAuthenticated()){
		//does the user own the campground
		Comment.findById(req.params.comment_id,function(err, foundComment)		{
			if(err){
				req.flash("error","Comment not found.");
				res.redirect("back");
			}
			else{
				//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error","You dont have the permissions to do that");
					res.redirect("back");
				}	
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in first.")
		res.redirect("back");
	}
}


middlewareObj.isLoggedIn= function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in first.");
	res.redirect("/login");
}




module.exports=middlewareObj;