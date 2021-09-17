var mongoose = require("mongoose");

var ConversationSchema = new mongoose.Schema(
    {
        members:{
            type:Array,
        },

    },
    {timestampts:true}
        
);

module.exports = mongoose.model("Conversation", ConversationSchema);