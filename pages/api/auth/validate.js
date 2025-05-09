import pool from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.headers;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Session validation error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}