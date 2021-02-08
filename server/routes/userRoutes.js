/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

//NOTE: need method override for put

module.exports = (db) => {

  //login function
  const login = function(email, password) {
    /*
      return db.getUser(email)
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      })
    */
  }

  //get user data
  router.get("/", (req, res) => {
    /*
    return db.getUser(userId)
    .then(user => user);
    .catch(err => ....)
    db query SELECT * FORM users where id = id
    */
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
    /*
    const {email, password} = req.body;
    login(email, password)
    .then(user => {
      if (!user) {
        res. send({error: "error"});
        return;
      }
      req.session.userId = user.id;
      res.send(....);
    })
    .catch(e => res.send(e));
    */
  });

  //logout
  router.put("/logout", (req, res) => {
    /*
    req.session.userId = null;
    res.send(....)
    */
  });


  //create new user
  router.put("/register", (req, res) => {
    /*
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 12);
    db.addUser(user)
    .then(user => {
      if (!user) {
        res.send({error: "error"});
        return;
      }
      req.session.userId = user.id;
    })
    .catch(e => res.send(e));
    */
  });

  return router;
};
