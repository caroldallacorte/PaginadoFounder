import pool from '../../../utils/db';

export default async function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        // Get all mentors with their specialties
        const mentorsResult = await pool.query(
          'SELECT * FROM mentores ORDER BY id'
        );
        
        // For each mentor, get their specialties
        const mentorsWithSpecialties = await Promise.all(
          mentorsResult.rows.map(async (mentor) => {
            const specialtiesResult = await pool.query(
              'SELECT especialidade FROM mentor_especialidades WHERE mentor_id = $1',
              [mentor.id]
            );
            
            const especialidades = specialtiesResult.rows.map(row => row.especialidade);
            
            return {
              ...mentor,
              especialidades
            };
          })
        );
        
        return res.status(200).json(mentorsWithSpecialties);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        return res.status(500).json({ message: 'Failed to fetch mentors' });
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
        
        const { nome, cargo, empresa, especialidades, contato, foto } = req.body;
        
        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          
          // Insert mentor
          const mentorResult = await client.query(
            `INSERT INTO mentores 
            (nome, cargo, empresa, contato, foto) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [nome, cargo, empresa, contato, foto]
          );
          
          const newMentor = mentorResult.rows[0];
          
          // Insert specialties if provided
          if (especialidades && especialidades.length > 0) {
            for (const especialidade of especialidades) {
              await client.query(
                'INSERT INTO mentor_especialidades (mentor_id, especialidade) VALUES ($1, $2)',
                [newMentor.id, especialidade]
              );
            }
          }
          
          await client.query('COMMIT');
          
          // Return the mentor with specialties
          return res.status(201).json({
            ...newMentor,
            especialidades: especialidades || []
          });
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error adding mentor:', error);
        return res.status(500).json({ message: 'Failed to add mentor' });
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
        
        const { id, nome, cargo, empresa, especialidades, contato, foto } = req.body;
        
        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          
          // Update mentor
          const mentorResult = await client.query(
            `UPDATE mentores 
            SET nome = $1, cargo = $2, empresa = $3, contato = $4, foto = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *`,
            [nome, cargo, empresa, contato, foto, id]
          );
          
          if (mentorResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Mentor not found' });
          }
          
          const updatedMentor = mentorResult.rows[0];
          
          // Delete existing specialties and insert new ones
          await client.query('DELETE FROM mentor_especialidades WHERE mentor_id = $1', [id]);
          
          if (especialidades && especialidades.length > 0) {
            for (const especialidade of especialidades) {
              await client.query(
                'INSERT INTO mentor_especialidades (mentor_id, especialidade) VALUES ($1, $2)',
                [id, especialidade]
              );
            }
          }
          
          await client.query('COMMIT');
          
          // Return the updated mentor with specialties
          return res.status(200).json({
            ...updatedMentor,
            especialidades: especialidades || []
          });
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error updating mentor:', error);
        return res.status(500).json({ message: 'Failed to update mentor' });
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
        
        // Start a transaction
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          
          // Delete from mentor_especialidades first due to foreign key constraint
          await client.query('DELETE FROM mentor_especialidades WHERE mentor_id = $1', [id]);
          
          // Then delete the mentor
          const result = await client.query(
            'DELETE FROM mentores WHERE id = $1 RETURNING *',
            [id]
          );
          
          if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Mentor not found' });
          }
          
          await client.query('COMMIT');
          return res.status(200).json({ success: true });
        } catch (err) {
          await client.query('ROLLBACK');
          throw err;
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error deleting mentor:', error);
        return res.status(500).json({ message: 'Failed to delete mentor' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}