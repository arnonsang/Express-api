const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const UserSchema = new Schema({
    uid: {
        type: String,
        default: uuidv4()
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn:[String]
});

const myDB = mongoose.connection.useDb(process.env.ICKURL_DB || 'URL');
module.exports.User = myDB.model('User', UserSchema);