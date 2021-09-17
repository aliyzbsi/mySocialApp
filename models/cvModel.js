var mongoose = require("mongoose");
moment = require('moment');

moment.locale('tr');

var CvSchema = new mongoose.Schema({

    myImage:{type:String},
    ozet:{type:String},
   email:{type:String},
    bolum: { type: String },
    egitimYil: { type: Date },
    oad: { type: String },
    aciklama: { type: String },
    firstName:{type:String},
    lastName:{type:String},
       gorev:{ type:String},
    gorevYil:{type: Date},
    isAd:{type: String},
    acikla:{ type: String},
    adres:{type:String},
    phone:{type:Number},
    userId:{type:String},
    date: { type: String, default: moment().format("lll") },
    time: { type: String, default: moment().format("LLL") },
},
{ timestampts: true }
);

module.exports = mongoose.model("Cv", CvSchema);