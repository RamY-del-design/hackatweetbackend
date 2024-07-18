var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');

router.get('/', (req, res) => {
    User.find().then(data => {
      if (data) {
        res.json({ result: true, canBookmark: data.canBookmark });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    });
  });