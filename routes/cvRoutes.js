var express = require('express'),
    User = require("../models/userModel"),
    Cv = require("../models/cvModel"),
    Exp = require("../models/expModel"),
    multer = require("multer"),
    session = require('express-session'),
    router = express.Router();







router.get('/myCv', function (req, res) {

    if (req.user) {

        Cv.find({ 'userId': req.user.id }, function (err, cv) {

            res.render('resume/myCv', {
                foundCv: cv

            });

        });

    } else {

        res.render('admin/signin', {});

    }
});

router.get('/allCv', function (req, res) {

    Cv.find(function (err, cv) {

        res.render('resume/allCv', {
            foundCv: cv

        });
    });
});

router.get("/cv/:cvId", function (req, res) {
   
    Cv.findById(req.params.cvId)
        .then(function (foundCv) {
            res.render("resume/showCv", { foundCv: foundCv });
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
        })
});

router.get("/cv/:cvId/edit", isLoggedIn, function (req, res) {
    
    
    Cv.findById(req.params.cvId, function (err, foundCv) {
        
        if(req.user._id != foundCv.userId){
            
            res.redirect("/");

        }else{

            if (err) throw err;
            res.render("resume/updateCv", { foundCv: foundCv });

        }

    });

});

router.put("/cv/:cvId", isLoggedIn, function (req, res) {
    
    

   
    console.log("============================================================");

    Cv.findByIdAndUpdate(req.params.cvId, req.body, function (err, cv) {
        if (err) throw err;
    });

});


router.post("/cvImage/:cvId", isLoggedIn, function (req, res) {
    
    console.log("============================================================");

    var fileRealName = "";

    //MULTER-UPLOAD
    var Storage=multer.diskStorage({
        destination:function(req,file,callback){
            callback(null,"./public/files")
        },
        filename:function(req,file,callback){
            var file = file.fieldname + "__" + Date.now() + "__" + file.originalname;
            fileRealName = file;
            callback(null, file);
        }
    });

    var yukleme=multer({storage:Storage}).array("file",1);

    yukleme(req,res,(err)=>{
        if(err){
            console.log(err);
            return res.end("Birşeyler Yanlış Gitti");
        }

        return res.end(fileRealName);
    });



});







function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}




module.exports = router;
