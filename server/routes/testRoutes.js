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

user
{
  id: 1,
  username: 'AAAAAAAAAAA',
  email: 'AAAAAAAAAAA',
  password: 'AAAAAAAAAAAAA',
  description: 'AAAAAAAAAAAAAAAAAA',
  profile_img_url: 'AAAAAAAAAAAAAAAAAAAA'
}
*/
module.exports = (db) => {
  router.get('/test', (req, res) => {
    return db.testQuery()
    .then(queryRes => res.send(queryRes))
    .catch(err => console.log(Error(err)));
  });

  return router;
};
