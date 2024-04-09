import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { connection } from '../utils/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userRepository = connection.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({ username, password: hashedPassword });
    await userRepository.save(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error while registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const userRepository = connection.getRepository(User);

    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ user: { id: user.id, username: user.username } }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error while logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error while logging out:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
