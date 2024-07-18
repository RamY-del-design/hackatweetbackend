const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
 author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Clé étrangère vers les users
 dateCreate: Date,                                               // Date de création
 message: String,                                                // Contenu du message
 nbLike: Number,                                                 // Nombre de like
 tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],  // Tableau de clés étrangère vers les tags
});

const Messages = mongoose.model('messages', messageSchema);

module.exports = Messages;