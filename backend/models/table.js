const mongoose = require('mongoose')

const TSchema = mongoose.Schema({
    Email:{type:String},
    user_name:{type:String},
    pass_word:{type:String}
});
const Table = mongoose.model("Table",TSchema);
module.exports = Table;   