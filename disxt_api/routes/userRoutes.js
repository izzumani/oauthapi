const express = require('express');
const router = express.Router();
const cors = require("cors")
const user_controller = require('../controllers/controller');

const bodyParser = require('body-parser');

var corsOptions = {
    // origin: "http://localhost:8081"
    origin: "*"
  };
  
router.use(cors(corsOptions));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));


router.get('/',function(req,res){
    res.send("Welcome to disx APIS");

});
// get a list of all users
router.get('/userslist',user_controller.tokenValidation,user_controller.get_user_list);
// get details of a users passed in the query oaras
router.get('/userdetails',user_controller.tokenValidation,user_controller.get_user);
// POST request to add users.
router.post('/addnewusers',user_controller.tokenValidation, user_controller.add_new_user);
// POST request to login users
router.post('/login', user_controller.login);

router.post('/login', user_controller.logout);

module.exports = router;

