const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route POST api/Users
// @desc    Register User
// @access Public

router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please inter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min:6})

] , 
async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log("errors ", errors);
        return res.status(400).json({ errors: errors.array()});
    }
    
    const {name, email, password} = req.body;
    
    try{
    let user = await User.findOne({email});  // email : email , but we can use only email because they had the same name
   
    //check if user already exist
    if(user){
        res.status(400).json({ errors: [{msg: 'User already exists'}]});
    } 
    //Get user grAvatr 
    const  avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        password,
        avatar
    })

    //Encrypt  password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    //Return jsonWebToken
    const paylaod = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        paylaod,
        config.get('jwtSecret'),
        {expiresIn: 3600*100},  // optionel mais recomendé
        (err, token) =>{
            if(err) throw err;
            res.json({ token });
        } );
}catch(err){
    console.log(err.message);
    res.status(500).send('Server error');
}


});

module.exports  = router;