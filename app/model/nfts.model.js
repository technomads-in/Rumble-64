const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tansSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    symbol:{
        type:String,
        required:true
    }, 
    decimals:{
        type:Number,
        required:true
    },
    tokenAuthority:{
        type:String,
        required:true
    },
    supply:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    tokenAddress:{
        type:String,
        required:true
    }
}, { versionKey: false })

module.exports = mongoose.model("rumbelapi", tansSchema);