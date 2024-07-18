const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
 author: String, // Clé étrangère ---à définir---
 dateCreate: Date, // Date de création
 message: String, // Contenu du message
 tags: String, // Clé enfant ---à définir---
 nbLike: Number, // Nombre de like
});

const Messages = mongoose.model('messages', messageSchema);

module.exports = Messages;