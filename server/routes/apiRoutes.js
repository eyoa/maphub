/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  // Root browse list of maps show all public ones
  router.get("/", (req, res) => {
    // getMapList (same as below with less params)
    console.log("Root ");
    res.send("Root");
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


  // queries for map list (example favorites)
  router.get("/maps", (req, res) => {
    console.log("Get maps list route");
    res.send("Get maps list route");
     // getMapList

    // will query the db for maps
    // db.theMapQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // queries for single map details (include pins list)
  router.get("/map", (req, res) => {
    console.log("Get map details route");
    res.send("Get map details route");
     // getMapDetails

    // will query the db for map specific stuff
    // db.theMapQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // put create map entry
  router.put("/map", (req, res) => {
    console.log("Create map route");
    res.send("Create map route");
    // addMap

    // will query the db for map specific stuff
    // db.theQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // edit map entry details
  router.patch("/map", (req, res) => {
    console.log("map details edited! route");
    res.send("Map details edited! route");
    // updateMap

    // will query the db for map specific stuff
    // db.theQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });


  // remove a map
  router.delete("/map", (req, res) => {
    console.log("Map deleted route");
    res.send("Map deleted route");
    //removeMap

    // will query the db for map specific stuff
    // db.theQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  // queries for pin details
  router.get("/pin", (req, res) => {
    console.log("Get pin details route");
    res.send("Get pin details route");
    // getPins

    // will query the db for pin details
    // db.thePinQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

    // create new pin
    router.put("/pin", (req, res) => {
      console.log("creat new pin route");
      res.send("Create new pin route");
      //addPin

      // will query the db for pin details
      // db.thePinQuery({params})
      //     .then(data => {
      //     })
      //     .catch(err => {
      //     });
    });

    // edit pin details
    router.patch("/pin", (req, res) => {
      console.log("editing pin details route");
      res.send("editing pin details route");

      //updatePin

      // will query the db for pin details
      // db.thePinQuery({params})
      //     .then(data => {
      //     })
      //     .catch(err => {
      //     });
    });


    // remove pin
    router.delete("/pin", (req, res) => {
      console.log("pin removed route");
      res.send("pin removed route");
      // removePin

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
      // getCollaboars

      // will query the db for map specific stuff
      // db.theQuery({params})
      //     .then(data => {
      //     })
      //     .catch(err => {
      //     });
    });

    // add collaborator to map
    router.put("/collaborators", (req, res) => {
      console.log("Get collaborators list route");
      res.send("Get collaborators list route");
      //addCollaborator

      // will query the db for map specific stuff
      // db.theQuery({params})
      //     .then(data => {
      //     })
      //     .catch(err => {
      //     });
    });

          // remove collaborator from map
  router.delete("/collaborators", (req, res) => {
    console.log("Collaborator removed from list route");
    res.send("Collaborator removed from list route");
    // removeCollaborator

    // will query the db for map specific stuff
    // db.theQuery({params})
    //     .then(data => {
    //     })
    //     .catch(err => {
    //     });
  });

  return router;
};
