const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const URLSchema = new Schema({
    uuid: {
        type: String,
        default: uuidv4()
    },
    original_url: {
        type: String,
        required: true
    },
    shorten_url:{
        type: String,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    },
    clicked: {
        type: Number,
        default: 0
    },
    adsTimes: {
        type: Number,
        default: 0
    },
    title: {
        type: String,
        default: "ICKURL"
    },
    desc: {
        type: String,
        default: "Forever free url shortener for your sharing | Made with love by ICKDEV"
    },
    img: {
        type: String,
        default: "https://cdn.discordapp.com/attachments/885089951207804949/907257498069794856/Ickstaycoding.png"
    },
},);

const myDB = mongoose.connection.useDb(process.env.ICKURL_DB || 'URL');
module.exports.URL = myDB.model('URL', URLSchema);