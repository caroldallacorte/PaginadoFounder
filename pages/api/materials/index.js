import pool from '../../../utils/db';

export default async function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM materiais_apoio ORDER BY id'
        );
        return res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching materials:', error);
        return res.status(500).json({ message: 'Failed to fetch materials' });
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
        
        const { nome, ano, link } = req.body;
        
        const result = await pool.query(
          `INSERT INTO materiais_apoio 
          (nome, ano, link) 
          VALUES ($1, $2, $3) 
          RETURNING *`,
          [nome, ano, link]
        );
        
        return res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error adding material:', error);
        return res.status(500).json({ message: 'Failed to add material' });
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
        
        const { id, nome, ano, link } = req.body;
        
        const result = await pool.query(
          `UPDATE materiais_apoio 
          SET nome = $1, ano = $2, link = $3
          WHERE id = $4
          RETURNING *`,
          [nome, ano, link, id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Material not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating material:', error);
        return res.status(500).json({ message: 'Failed to update material' });
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
          'DELETE FROM materiais_apoio WHERE id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Material not found' });
        }
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting material:', error);
        return res.status(500).json({ message: 'Failed to delete material' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}