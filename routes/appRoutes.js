var express = require('express'),
    Blog = require("../models/blogModel"),
    List=require("../models/toDoListModel"),
    User = require("../models/userModel"),
    Cv = require("../models/cvModel"),
   
    router = express.Router();



// router.get("/myblog3",(req, res)=> {
//     Blog.find({},(err,foundBlogs)=>{
//         if(err){
//             console.log("HATA !");
//             console.log(err);
//         }else{
//             console.log("BÜTÜN BLOGLAR ..");
//             console.log(foundBlogs);
//             res.render("myblog",{foundBlogs:foundBlogs}); 
//         }    
//     })
    
// });


router.get('/', function(req, res) {


    if(req.user){
        User.find({'userId':req.user.id},function (err, user) {
        List.find({'userId':req.user.id},function (err, list) {
        
            res.render('home', {
               foundList : list,
               foundUsers:user,
                userInfo:req.user
            });

        });
    });
    }else{

        res.render('admin/signin', {});

    }

  
});


router.post("/",async (req,res)=>{
    
    res.status(200).json(['success']);

});

// router.get('/cv', function(req, res) {

//    Cv.find(function (err, user) {
//         Edu.find(function (err, edu) {
//             Exp.find(function (err,exp) {
//             res.render('resume/cv', {
//                foundCv:user,
//                foundCv:edu,
//                foundCv:exp
//             });
//         });
//     });
// });
// });


router.get("/about", function (req, res) {
    res.render("about");
});

router.get("/contact", function (req, res) {
    res.render("contact");
});
// router.get("/cv", function (req, res) {
//     res.render("cv");
// });
// router.get("/myblog", function (req, res) {
//     res.render("myblog");
// });

// router.get("/toDoListe", function (req, res) {
//     res.render("toDoList/toDoListe");
// });




module.exports = router;