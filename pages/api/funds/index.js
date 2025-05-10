import pool from '../../../utils/db';

export default async function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        const result = await pool.query(
          'SELECT * FROM fundos_parceiros ORDER BY id'
        );
        return res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching funds:', error);
        return res.status(500).json({ message: 'Failed to fetch funds' });
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
        
        const { parceiro, tipoInvestimento, tamanhoCheque, tese, contato, logo } = req.body;
        
        const result = await pool.query(
          `INSERT INTO fundos_parceiros 
          (parceiro, tipo_investimento, tamanho_cheque, tese, contato, logo) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          RETURNING *`,
          [parceiro, tipoInvestimento, tamanhoCheque, tese, contato, logo]
        );
        
        return res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error adding fund:', error);
        return res.status(500).json({ message: 'Failed to add fund' });
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
        
        const { id, parceiro, tipoInvestimento, tamanhoCheque, tese, contato, logo } = req.body;
        
        const result = await pool.query(
          `UPDATE fundos_parceiros 
          SET parceiro = $1, tipo_investimento = $2, tamanho_cheque = $3, tese = $4, contato = $5, logo = $6, updated_at = NOW()
          WHERE id = $7
          RETURNING *`,
          [parceiro, tipoInvestimento, tamanhoCheque, tese, contato, logo, id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Fund not found' });
        }
        
        return res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating fund:', error);
        return res.status(500).json({ message: 'Failed to update fund' });
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
          'DELETE FROM fundos_parceiros WHERE id = $1 RETURNING *',
          [id]
        );
        
        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Fund not found' });
        }
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting fund:', error);
        return res.status(500).json({ message: 'Failed to delete fund' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}