/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  //login function
  const login = function(email, password) {
    return db.getUser({email})
      .then(result => {
        const user = result[0];
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      })
      .catch(e => res.send(e));
  };

  //getData via cookies
  router.get("/currentUser", (req, res) => {
    console.log("currentUser Route server");

    const userId = req.session.userId;

    console.log(userId);
    if (!userId){
      res.send({message: "not logged in"});
      return;
    }

    return db.getUser({id:userId})
    .then(user => {
      if(!userId){
        res.send({error: "no such user"})
        return;
      }
      res.send({user});
    })
    .catch(e => res.send(e))
  });

  //get user data
  router.get("/", (req, res) => {
    return db.getUser(userId)
    .then(user => user)
    .catch(e => res.send(e))
  });

  //update user data
  router.put("/", (req, res) => {
    /*
    db.setUser(username, password, email ....)
    .then(updatedUser => updatedUser)
    .catch(err => ...)
      db query UPDATE users SET... WHERE id=id
    */
  });

  //login
  router.put("/login", (req, res) => {
    const {email, password} = req.body;
    login(email, password)
      .then(user => {
        if (!user) {
          res. send({error: "login error"});
          return;
        }
        req.session.userId = user.id;
        res.send({user});
      })
      .catch(e => res.send(e));

  });

  //logout
  router.put("/logout", (req, res) => {
    req.session.userId = null;
    res.send({});
  });

  //create new user
  router.put("/register", (req, res) => {
    console.log("serverside userRoutes");
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    db.addUser(user)
    .then(result => {
      const user = result[0];
      console.log ("from db addUser", user);
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      res.send({user});
    })
    .catch(e => res.send(e));

  });

  return router;
};
