import pool from '../../../utils/db';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { password } = req.body;

  try {
    // Get stored password hash from database
    const result = await pool.query('SELECT password_hash FROM admin_users WHERE id = 1');
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const storedHashedPassword = result.rows[0].password_hash;
    
    // Generate hash for user input
    const hashedInputPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (hashedInputPassword === storedHashedPassword) {
      // Create a session token
      const token = crypto.randomBytes(64).toString('hex');
      
      // Store token in database with expiry
      await pool.query(
        'INSERT INTO sessions (token, expires_at) VALUES ($1, NOW() + INTERVAL \'24 hours\')',
        [token]
      );
      
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}