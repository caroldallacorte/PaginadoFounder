import pool from '../../../utils/db';

export default async function handler(req, res) {
  const { category } = req.query;
  
  // Input validation
  if (!category || typeof category !== 'string') {
    return res.status(400).json({ message: 'Invalid category' });
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM benefits WHERE category = $1 ORDER BY id',
          [category]
        );
        return res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching benefits:', error);
        return res.status(500).json({ message: 'Failed to fetch benefits' });
      }
      
    case 'POST':
      try {
        const { token } = req.headers;
        // Validate session
        const sessionResult = await pool.query(
          'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
          [token]
        );
        
        if (sessionResult.rows.length === 0) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const { parceiro, descricao, beneficio, comoAtivar, logo } = req.body;
        
        const result = await pool.query(
          `INSERT INTO benefits 
          (parceiro, descricao, beneficio, como_ativar, logo, category) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *`,
          [parceiro, descricao, beneficio, comoAtivar, logo, category]
        );
        
        return res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error adding benefit:', error);
        return res.status(500).json({ message: 'Failed to add benefit' });
      }

    case 'PUT':
      try {
        const { token } = req.headers;
        // Validate session
        const sessionResult = await pool.query(
          'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
          [token]
        );
        
        if (sessionResult.rows.length === 0) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const { id, parceiro, descricao, beneficio, comoAtivar, logo } = req.body;
        
        const result = await pool.query(
          `UPDATE benefits 
          SET parceiro = $1, descricao = $2, beneficio = $3, como_ativar = $4, logo = $5 
          WHERE id = $6 AND category = $7
          RETURNING *`,
          [parceiro, descricao, beneficio, comoAtivar, logo, id, category]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Benefit not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating benefit:', error);
        return res.status(500).json({ message: 'Failed to update benefit' });
      }
      
    case 'DELETE':
      try {
        const { token } = req.headers;
        // Validate session
        const sessionResult = await pool.query(
          'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
          [token]
        );
        
        if (sessionResult.rows.length === 0) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const { id } = req.body;
        
        const result = await pool.query(
          'DELETE FROM benefits WHERE id = $1 AND category = $2 RETURNING *',
          [id, category]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Benefit not found' });
        }
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting benefit:', error);
        return res.status(500).json({ message: 'Failed to delete benefit' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}