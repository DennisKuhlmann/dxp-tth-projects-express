let express = require('express');
let router = express.Router();
let db = require('../config/db');

router.get("/", (req, res) => {
    res.render('pages/to_do_list');
});

router.post('/addtodo', (req, res) => {
   let item = req.body.item;


    let query = `INSERT INTO 
                        tab_items 
                        SET 
                            dbf_str_name = ?`;
    db.query(query, [item], function(error, results, fields) {
        if (error) {
            console.error('Error executing the query', error);
            res.status(500).send('Error executing the query');
        } else {
            console.log('Item added successfully');
            res.send('Item added successfully');

        }
    });

});


module.exports = router;