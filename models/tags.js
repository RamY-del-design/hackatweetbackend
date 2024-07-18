const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
 tagName : String,      //Nom du tag
 nbUsesTags: Number,    //Nombre d'utilisation du tag
});

const Tags = mongoose.model('tags', tagSchema);

module.exports = Tags;