import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imagePath = req.file.path;

    // Upload to Cloudinary
    const cloudResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'users',
    });

    // Delete local file
    fs.unlinkSync(imagePath);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: cloudResult.secure_url,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
