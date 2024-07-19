var express = require('express');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const { getOneUser } = require('../modules/getOneUser');
const { AddTag, getTagAndUpdateNumber } = require('../modules/moduleTag');
const User = require('../models/users');
const Message = require('../models/messages');
const Tag = require('../models/tags');

router.get('/', (req, res) => {
    Message.find()
    .populate({path:'author'})
    .then(data => {
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

    // récupération de l'Id utilisateur
    const user = getOneUser({token: req.body.token});

    // Récupération des tags contenu dans le message sous forme de tableau
    const tagsInMessage = req.body.message.match(new RegExp(/#\w+/gm));

    let tagsInfos=[];

    tagsInMessage.map(tagName=>{
        const tag = getTagAndUpdateNumber({tagName: tagName}, 1);
        tag.then(tagData => {
            if(tagData){
                tagsInfos.push(tagData.tag._id)
            }
            else {
                const tagAdd = AddTag(tagName);
                tagAdd.then((tagData)=>{
                    tagsInfos.push(tagData.tag._id)
                })
            }
        });        
    })
    user.then (userData=> {
        const newMessage = new Message({
            author: userData.user._id,
            message: req.body.message,
        }); 
        newMessage.save().then(newDoc => {
            res.json({ result: true, message: newDoc });})
    });
    
}); 

router.post('/deleteMessage', (req, res) => {
    if (!checkBody(req.body, ['token', 'messageId'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    try{
        Message.findOne({ _id: req.body.messageId}).then(messageToDelete=>{
            if (!messageToDelete) {
                throw new Error(`Erreur message not found : ${messageToDelete}`);
            }
            console.log("messageToDelete =>", messageToDelete)
            return messageToDelete.message.match(new RegExp(/#\w+/gm));   
        }
        ).then(tagsInMessage=>{
            console.log("tagsInMessage =>", tagsInMessage)     
            tagsInMessage.map(tagName=>{
                console.log("tagName =>",tagName)
                getTagAndUpdateNumber({tagName: tagName}, -1).then((tag)=>console.log("tag =>",tag) );
            })   
        }).then(
            Message.deleteOne({ _id: req.body.messageId}).then((resp)=>{
                if (resp.deletedCount){
                    res.json({ result: true, message: 'Suppresion effectué' });
                    return;
                }else{
                    res.json({ result: false, message: 'Pas de message à supprimer' });
                    return;}
                })
    )
    } catch (error) {
        res.json({ result: false, message: `Impossible de supprimer le message : ${error}` });
    }
})

module.exports = router;