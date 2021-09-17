var express = require("express"),
    Message = require("../models/messageModel"),
    router = express.Router();
//add

router.post("/messenger", async (req, res) => {

    


    const newMessage = new Message(req.body)({
         sender: req.body.sender,
         text: req.body.text
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
        res.render("chat/messenger");
    } catch (err) {
        res.status(500).json(err)
    }
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


router.get("/:conversationId", async (req, res) => {


    try {

        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);

    } catch (err) {
        res.status(500).json(err);
    }

})



router.get("/messenger", (req, res) => {
    res.render("chat/messenger");
});

router.post("/messenger", (req, res) => {

    let myImage = req.body.cv.myImage;
    let userId = req.user._id;
    let firstName = req.body.user.firstName;
    let lastName = req.body.user.lastName;
    let sender = req.body.message.sender;
    let text = req.body.message.text;

    let message = {
        userId: userId,
        myImage: myImage,
        firstName: firstName,
        lastName: lastName,
        sender:sender,
        text:text

    };

})






module.exports = router;