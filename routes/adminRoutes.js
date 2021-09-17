var express = require('express'),
    User = require("../models/userModel"),
    Cv = require("../models/cvModel"),
    multer = require("multer"),
    session = require('express-session');
    passport = require("passport"),
    router = express.Router();


// Routes


router.get("/signup", function (req, res) {
    res.render("admin/signup");
});

// router.post("/profileImage/:userId", function (req, res) {

//     console.log("============================================================");





// });
  // var fileRealName = "";

    // //MULTER-UPLOAD
    // var Storage=multer.diskStorage({
    //     destination:function(req,file,callback){
    //         callback(null,"./public/profileImage")
    //     },
    //     filename:function(req,file,callback){
    //         var file = file.fieldname + "__" + Date.now() + "__" + file.originalname;
    //         fileRealName = file;
    //         callback(null, file);
    //     }
    // });

    // var yukleme=multer({storage:Storage}).array("myImage",1);

    // yukleme(req,res,(err)=>{
    //     if(err){
    //         console.log(err);
    //         return res.end("Birşeyler Yanlış Gitti");
    //     }


    // });
router.post("/signup", (req, res) => {

    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
        // myImage:fileRealName
    });

    User.register(newUser, req.body.password, (err, user) => {

        if (err) {
            console.log(err, "Farklı Bir Email Adresi Kullanınız !");
            res.redirect("/signup");
        }


        passport.authenticate("local")(req, res, () => {

            res.redirect("/addnewcv");

        });
        router.get("/addnewcv", (req, res) => {

            
            
            User.find({'userId':req.user.id},function (err, user) {

                res.render('resume/newCv', {
                   foundUser : user

                });

            });


        });

    })
});



router.post("/addnewcv", (req, res) => {

    let myImage = req.body.cv.myImage;
    let password = req.body.cv.password;
    let firstName = req.body.cv.firstName;
    let lastName = req.body.cv.lastName;
    let adres = req.body.cv.adres;
    let phone = req.body.cv.phone;
    let ozet = req.body.cv.ozet;
    let bolum = req.body.cv.bolum;
    let egitimYil = req.body.cv.egitimYil;
    let oad = req.body.cv.oad;
    let email = req.body.cv.email;
    let aciklama = req.body.cv.aciklama;
    let gorev = req.body.cv.gorev;
    let gorevYil = req.body.cv.gorevYil;
    let isAd = req.body.cv.isAd;
    let acikla = req.body.cv.acikla;
    let userId = req.user._id;

    //    let sessionData = req.session;
    //     console.log(req.session);

    let newCv = {
        userId: userId,
        myImage: myImage,
        email: email,
        firstName: firstName,
        lastName: lastName,
        adres: adres,
        phone: phone,
        bolum: bolum,
        egitimYil: egitimYil,
        oad: oad,
        aciklama: aciklama,
        gorev: gorev,
        gorevYil: gorevYil,
        isAd: isAd,
        ozet: ozet,
        acikla: acikla
    };


    /*
        if eski kaydi var sa guncelle
        else yoksa create yap
    */


    Cv.create(newCv)
    .then(function (newAddedCv) {
        //console.log(newAddedCv);
        //res.render("home");
        //res.redirect('/');

    })
    .catch(function (err) {
        console.log("======================= ERROR ===========================");
        console.log(err);
        res.send(err);
    })

    /*


    */


});




router.get("/signin", function (req, res) {
    res.render("admin/signin");
});

router.post("/signin", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/signin"

    }), (req, res) => {

    });
router.get("/signout", (req, res) => {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}


module.exports = router;