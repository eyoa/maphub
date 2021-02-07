//THIS FILE IS FOR TESTING QUERIES

const express = require('express');
const router  = express.Router();

/*
pin
{
  id: 1,
  title: 'royal ontario museum',
  description: 'AAAAAAAAAAAA',
  img_url: 'giegihegheigheighei',
  latitude: 43.667683,
  longitude:-79.394661,
  map_id: 1
}

*/
module.exports = (db) => {
  router.get('/test', (req, res) => {
    return db.getUser(null, '1@gmail.com')
    .then(queryRes => res.send(queryRes))
    .catch(err => console.log(Error(err)));
  });

  return router;
};
