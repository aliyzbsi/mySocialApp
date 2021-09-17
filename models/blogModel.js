var mongoose = require("mongoose");
moment = require('moment');

moment.locale('tr');

var BlogSchema = new mongoose.Schema({
    title: { type: String, required: "cannot be empty" },
    userId: { type: String },
    comSentence: { type: String, required: "cannot be empty" },
    comImage: { type: String, required: "cannot be empty" },
    byazar:{type:String,required:" ! "},
    blog: { type: String, required: "cannot be empty" },
    date: { type: String, default: moment().format("lll") },
    time: { type: String, default: moment().format("LLL") },
},
{ timestampts: true }
);

module.exports = mongoose.model("Blog", BlogSchema);