var mongoose = require('mongoose');



mongoose.Promise = Promise;

var ExpSchmea = new mongoose.Schema({
    gorev:{
        type:String
        
    },
    gorevYil:{
        type: Date
    },
    isAd:{
        type: String
        
    },
    acikla:{
        type: String
       
    },
    userId:{
        type:String
       
    }
});

module.exports = mongoose.model('Exp', ExpSchmea);