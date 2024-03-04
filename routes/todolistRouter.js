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
                            dbf_str_task = ?`;
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

// setup datatables
router.post('/todo_list_datatables', (req, res) => {
    let draw = req.body.draw;
    let orderDirection = req.body.order[0].dir;
    let start = parseInt(req.body.start);
    let length = parseInt(req.body.length);
    let searchValue = req.body.search;

    // Create an array with your column names in the order they are arranged in DataTables
    let columns = [
        'dbf_str_task',
        'dbf_datetime_created',
        'dbf_int_status'
    ];

    let orderColumnIndex = req.body['order[0][column]'];
    let orderColumn;

    if (orderColumnIndex) {
        orderColumn = columns[orderColumnIndex];
    } else {
        orderColumn = 'dbf_int_index';
    }

    // Use the values to modify your database query
    let query = 'SELECT * FROM tab_items';

    if (searchValue) {
        query += ` WHERE 
                        dbf_str_task LIKE '%${searchValue}%' 
                `;
    }
    query += ` ORDER BY ${orderColumn} ${orderDirection} LIMIT ${start}, ${length}`;


    // New code to get the total count for recordsTotal and recordsFiltered
    db.query("SELECT COUNT(*) as total FROM tab_items", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database error: ' + err.message });
        } else {
            let recordsTotal = result[0].total;

            db.query(query, (err, rows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Database error: ' + err.message });
                } else {

                    res.json({
                        draw: draw,
                        recordsTotal: recordsTotal,
                        recordsFiltered: recordsTotal,
                        data: rows
                    });
                }
            });
        }
    });
});


router.post("/delete_task", (req, res) => {
    const taskID = req.body.taskID;
    const query = `DELETE FROM tab_items WHERE dbf_int_index = ${taskID}`;

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.json({ message: "To Do deleted successfully", data: result });
    });
});


router.post("/update_task", (req, res) => {
    const taskID = req.body.taskID;
    const query = `UPDATE tab_items SET dbf_int_status = 1 WHERE dbf_int_index = ${taskID}`;

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.json({ message: "To Do deleted successfully", data: result });
    });
});


module.exports = router;