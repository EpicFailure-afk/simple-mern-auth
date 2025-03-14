import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async(req, res) => {
    const {username, email, password} = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exisits' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, email, password: hashedPassword});

        res.status(201).json({ message: 'User registered successfully' });
    } catch(error){
        res.status(500).json({ message: 'Server Error' });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'invalid' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch(error){
        req.status(500).json({ message: 'Server Error' });
    }
}