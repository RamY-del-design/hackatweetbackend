const Tag = require('../models/tags');

async function AddTag(tagName){
    try{
        const tagNew = new Tag({tagName});
        if (!tagNew) {
            throw new Error(`Erreur Bdd : ${tagNew}`);
        }
        await tagNew.save().then(() =>{        })                
        return ({ result: true, tag: tagNew });
    } catch (error) {
        console.error(`Impossible d'enregistrer le tag : ${error}`);
    }
}
// Get Tag and Update compteur (:object, action)
async function getTagAndUpdateNumber(params, action){
    try{        
        const tagFind = await Tag.findOne(params);
        if (!tagFind) {
            throw new Error(`Erreur Bdd : ${user}`);
        }                    
        await Tag.updateOne(params, { $set: { nbUsesTags: tagFind.nbUsesTags+action } })
        .then ( ()=> {  });
        return ({ result: true, tag: tagFind })
        }catch (error) { 
        console.error(`Impossible de trouver le tag : ${error}`);
    }
}
  
module.exports = { AddTag, getTagAndUpdateNumber };
  