var express = require('express'),
    Blog = require("../models/blogModel"),
    router = express.Router();

router.get("/addNewBlog",isLoggedIn, (req, res) => {
    res.render("blog/newBlog");
});

router.post("/addNewBlog",isLoggedIn, (req, res) => {
    let title = req.body.data.blogTitle;
    let comSentence = req.body.data.comSentence;
    let comImage = req.body.data.comImage;
    let byazar=req.body.data.byazar
    let blog = req.body.data.blog;
    let userId = req.user._id;
    let username=req.user.username;

    let newBlog = { 
        title: title,
        userId:userId,
        username:username,
         comSentence: comSentence,
          comImage: comImage,
          byazar:byazar,
           blog: blog 
        };

   
    Blog.create(newBlog)
    .then(function(newAddedBlog){
        console.log(newAddedBlog);
        res.status(201).json(newAddedBlog);
    })
    .catch(function(err){
        console.log("======================= ERROR ===========================");
        console.log(err);
        res.send(err);
    })

});

    
// Routes
router.get('/myblog', function(req, res) {

    if(req.user){

       Blog.find({'userId':req.user.id},function (err, blog) {
        
            res.render('blog/myblog', {
               foundBlog : blog
             
            });

        });

    }else{

        res.render('admin/signin', {});

    }

});



router.get('/allblog', function(req, res) {

    Blog.find(function (err, blog) {
      
            res.render('blog/allBlog', {
               foundBlog : blog
                
        });
    });
});

router.get("/blogs/:blogId", function(req,res){
    

    Blog.findById(req.params.blogId)
    .then(function(foundBlog){
        res.render("blog/showBlog",{foundBlog:foundBlog});
    })
    .catch(function(err){
        console.log(err);
        res.send(err);
    })
});

router.delete("/blogs/:blogId", isLoggedIn,(req, res)=>{
    Blog.findByIdAndRemove(req.params.blogId,(err)=>{
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/myblog");
        }
    });
});

router.get("/blogs/:blogId/edit",isLoggedIn,function(req, res){
    Blog.findById(req.params.blogId, function(err, foundBlog){
       
        if(req.user._id != foundBlog.userId){
            
            res.redirect("/");

        }else{
        if(err) throw err;
        res.render("blog/updateBlog", {foundBlog:foundBlog});
    }
    });
});

router.put("/blogs/:blogId",isLoggedIn, function(req, res){
    console.log("============================================================");
    
    console.log(req.body);
    Blog.findByIdAndUpdate(req.params.blogId, req.body, function(err, blog){
        if(err) throw err;
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/signin");
}




module.exports = router;