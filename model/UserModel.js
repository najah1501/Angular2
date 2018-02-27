//information of the collection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
module.exports = mongoose.Schema(
    {
        name : String,
        age : String,
        address :String,
        result : String,
        CreatedDate :{ type:Date ,default:Date.now}
    }

);

