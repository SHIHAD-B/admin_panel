const express = require('express');
const router = express.Router();
const controller = require('../controller/controller')


router.get('/', controller.home);
router.get('/sign', controller.sign);
router.get('/admin', controller.admin);
router.post('/login', controller.login);
router.get('/edit/:id', controller.editid);
router.post('/signup', controller.signup);
router.post('/add', controller.add);
router.get('/adduser', controller.adduser);
router.get('/delete/:id', controller.deleteid);
router.post('/update/:id', controller.updateid);
router.get('/grant/:id', controller.grandid);
router.get('/block/:id', controller.blockid);
router.get('/search', controller.search);
router.get('/logout', controller.logout);
router.get('/home', controller.homepage);



module.exports = router;
