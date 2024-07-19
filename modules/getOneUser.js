const User = require('../models/users');

async function getOneUser(params){
    try {
        const user = await User.findOne(params)
        if (!user) {
            throw new Error(`Erreur Bdd : ${user}`);
        }
        return ({ result: true, user });
    }catch (error) {
            console.error(`Impossible d'obtenir l'utilisateur : ${error}`);
            return    
    };
}
  
module.exports = { getOneUser };
  