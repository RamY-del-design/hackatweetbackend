const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')

const tagSchema = mongoose.Schema({
 tagName : String,                      //Nom du tag
 nbUsesTags: {type: Number, default:1}, //Nombre d'utilisation du tag (Défaut: 1)
});
tagSchema.plugin(findOrCreate)
const Tags = mongoose.model('tags', tagSchema);

module.exports = Tags;