const express = require('express');
const router = express.Router();
const User = require('../model/user.model');

//register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username });
        //console.log(user)
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
});

//log in a user 
router.post('/login', async (req, res) => {
    try {
        //console.log(req.body)
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
        return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password' });
        }
        //todo generate a token

        res.status(200).send({ message: 'Login successful',user:{
            _id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        } });

        
    } catch (error) {
        console.error('Failes to login user:', error);
        res.status(500).send({ message: 'Login  failed Try again' });
        
    }
   
})  



module.exports = router;