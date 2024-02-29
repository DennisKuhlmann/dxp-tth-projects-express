let express = require('express');
let router = express.Router();

router.get("/", (req, res) => {
    res.render('pages/index');
});

router.get("/imprint", (req, res) => {
    res.render('pages/legal_documents/imprint');
});

router.get("/privacy", (req, res) => {
    res.render('pages/legal_documents/privacy');
});

router.get("/terms", (req, res) => {
    res.render('pages/legal_documents/terms');
});


module.exports = router;