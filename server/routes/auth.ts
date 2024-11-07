import { Router } from 'express';
import { executeQuery } from '../db';
import { User } from '../../src/types';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = `
      SELECT 
        id, name, email, role, department, status,
        TO_CHAR(last_login, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"') as last_login
      FROM users 
      WHERE email = :email AND password_hash = DBMS_CRYPTO.HASH(UTL_RAW.CAST_TO_RAW(:password), 2)
    `;

    const users = await executeQuery<User>(sql, [email, password]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    if (user.status === 'denied') {
      return res.status(403).json({ message: 'Account access denied' });
    }

    // Update last login
    await executeQuery(
      'UPDATE users SET last_login = SYSTIMESTAMP WHERE id = :id',
      [user.id]
    );

    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signup', async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    // Check if email exists
    const existingUser = await executeQuery(
      'SELECT 1 FROM users WHERE email = :email',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Insert new user
    const sql = `
      INSERT INTO users (
        id, name, email, password_hash, role, department, status, last_login
      ) VALUES (
        user_id_seq.NEXTVAL, :name, :email,
        DBMS_CRYPTO.HASH(UTL_RAW.CAST_TO_RAW(:password), 2),
        'user', :department, 'pending', SYSTIMESTAMP
      ) RETURNING id INTO :id
    `;

    const result = await executeQuery(sql, [
      name,
      email,
      password,
      department
    ]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export const authRouter = router;