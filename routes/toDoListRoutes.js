var express = require('express'),
    List = require("../models/toDoListModel"),
    router = express.Router();

router.get("/toDoListe",isLoggedIn, (req, res) => {
    res.render("toDoList/toDoListe");
});

router.post("/toDoListe",isLoggedIn, (req, res) => {
    let yListe = req.body.yListe;
    let userId = req.user.id;
    let yazar=req.body.yazar;
    let tarih=req.body.tarih;

    let liste = { yListe: yListe ,userId:userId,yazar:yazar,tarih:tarih};

    console.log(liste);

    List.create(liste)
        .then((toDoListe) => {
          
            res.status(201).json(toDoListe);
        })
        .catch((err) => {
            console.log("HATA router!");
            res.send(err);
        });
});
router.get("/lists/:listId", (req, res) => {
    console.log(req.params.listId);
    
    List.findById(req.params.listId)
        .then((foundList) => {
            res.render("toDoList/showlist", { foundList: foundList });


        })
        .catch((err) => {
            console.log("HATA !")
            console.log(err);
            res.send(err);

        });
});
router.delete("/lists/:listId",isLoggedIn,(req,res)=>{
    List.findByIdAndRemove(req.params.listId,(err)=>{
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.redirect("/");
        }
    })
});
router.get("lists/:listId/edit",isLoggedIn,(req,res)=>{
    List.findById(req.params.blogId,(err,foundList)=>{
        if(err) throw err;
        res.render("updateList",{foundList:foundList});
    });
});

router.put("lists/:listId",isLoggedIn,(req,res)=>{
    console.log("============================================================");
    console.log("============================================================");
    console.log("============================================================");
    console.log("============================================================");
 
    List.findByIdAndUpdate(req.params.listId, req.body, (err, list)=>{
        if(err) throw err;
    });
});





function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}




module.exports = router;