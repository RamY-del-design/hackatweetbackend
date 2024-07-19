const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
 author: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Clé étrangère vers les users
 dateCreate: {type: Date, default: Date.now},                    // Date de création (Défaut: la date d'enregistrement)
 message: String,                                                // Contenu du message
 nbLike: {type: Number, default: 0},                             // Nombre de likes (Défaut: 0)
 //tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],  // Tableau de clés étrangère vers les tags
});

const Messages = mongoose.model('messages', messageSchema);

module.exports = Messages;