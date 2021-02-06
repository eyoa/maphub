/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Root browse list of maps
  router.get("/", (req, res) => {
    // let query = `SELECT * FROM widgets`;
    // console.log(query);
    // db.query(query)
    //   .then(data => {
    //     const widgets = data.rows;
    //     res.json({ widgets });
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
  });


  // queries for map list
  router.get("/maps", (req, res) => {
    console.log("Get maps route");
    res.send("Get maps route");

    // will query the db for maps
    // db.theMapQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // queries for map details (include pins list)
  router.get("/map", (req, res) => {
    console.log("Get map details route");
    res.send("Get map details route");

    // will query the db for map specific stuff
    // db.theMapQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // queries for pin details
  router.get("/pin", (req, res) => {
    console.log("Get pin details route");
    res.send("Get pin details route");

    // will query the db for pin details
    // db.thePinQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

    // queries for collaborator list
    router.get("/collaborators", (req, res) => {
      console.log("Get collaborators list route");
      res.send("Get collaborators list route");

      // will query the db for map specific stuff
      // db.theQuery({params})
      //     .then(data => {
      //     })
      //     .catch(err => {
      //     });
    });


  return router;
};
