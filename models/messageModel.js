var mongoose = require("mongoose"),
    moment = require('moment');

    moment.locale('tr');

var MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: String,
        },
        sender: {
            type: String,
        },
        receiverid: {
            type: String,
        },text: {
            type: String,
        },
        date: {
            type: String, default: moment().format("DD-MM-YYYY"),
        },
        time: {
            type: String, default: moment().format("LTS"),
        },


    },
    { timestampts: true }

);

module.exports = mongoose.model("Message", MessageSchema);