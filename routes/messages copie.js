var express = require('express');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const Message = require('../models/messages');
const Tag = require('../models/tags');

router.get('/', (req, res) => {
    Message.find().then(data => {
      if (data) {
        res.json({ result: true, messages: data });
      } else {
        res.json({ result: false, error: 'No tweets found' });
      }
    });
  });

  
router.post('/addMessage', (req, res) => {
    if (!checkBody(req.body, ['token', 'message'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    async function getUserByToken(token){
        try {
            const user = await User.findOne({ token })
            if (!user) {
                throw new Error(`Erreur Bdd : ${user}`);
            }
            return ({ result: true, user });
        }catch (error) {
                console.error(`Impossible d'obtenir l'utilisateur : ${error}`);
                return    
        };
    }

    async function getTagByName(tagName){
        try{        
            const tagFind = await Tag.findOne({tagName});
            if (!tagFind) {
                throw new Error(`Erreur Bdd : ${user}`);
            }                    
            await Tag.updateOne({tagName}, { $set: { nbUsesTags: tagFind.nbUsesTags+1 } })
            .then ( ()=> {
                console.log("tagFind =>", tagFind)
            });
            return ({ result: true, tag: tagFind })
            }catch (error) { 
            console.error(`Impossible de trouver le tag : ${error}`);
        }
    }

    async function AddTagByName(tagName){
        try{
            const tagNew = new Tag({tagName});
            if (!tagNew) {
                throw new Error(`Erreur Bdd : ${user}`);
            }
            await tagNew.save().then(tag =>{
                console.log("TagAdded =>", tag)
            })                
            return ({ result: true, tag: tagNew });
        } catch (error) {
            console.error(`Impossible d'enregistrer le tag : ${error}`);
        }
    }

    // récupération de l'Id utilisateur
    const user = getUserByToken(req.body.token);

    // Récupération des tags contenu dans le message sous forme de tableau
    const tagsInMessage = req.body.message.match(new RegExp(/#\w+/gm));

    let tagsInfos=[];

    tagsInMessage.map(tagName=>{
        const tag = getTagByName(tagName);
        console.log("tag =>",tag)
        tag.then(tagData => {
            console.log("tagData =>",tagData)
            if(tagData){
                tagsInfos.push(tagData.tag._id)
            }
            else {
                const tagAdd = AddTagByName(tagName);
                console.log("tagAdd =>",tagAdd)
                tagAdd.then((tagData)=>{
                    console.log("tagDataAdd =>",tagData)
                    tagsInfos.push(tagData.tag._id)
                })
            }
        })
    })
    .then(()=>{
        user.then (userData=> {
            console.log("tagsInfos =>",tagsInfos)
            const newMessage = new Message({
                author: userData.user._id,
                message: req.body.message,
                tags: tagsInfos,
            }); 
            newMessage.save().then(newDoc => {
                res.json({ result: true, message: newDoc });})
        });
    })

    
}); 


module.exports = router;