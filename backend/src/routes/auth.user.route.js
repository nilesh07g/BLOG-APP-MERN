const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

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
        // generate a token
        const token = await generateToken(user._id);
        //console.log(token)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:true,
        })



        res.status(200).send({ message: 'Login successful',token,user:{
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

//logout a user
router.post('/logout', async (req, res) => {
    try {
        //for loging out we have to remove token
        res.clearCookie("token");
        res.status(200).send({ message: 'Logout successful' });
        
    } catch (error) {
        console.error('Failes to logout user:', error);
        res.status(500).send({ message: 'Logout  failed Try again' });
        
    }
    
})

//get users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
})

// update a user role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
});

module.exports = router;