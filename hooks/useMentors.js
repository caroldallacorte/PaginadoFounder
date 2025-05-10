import { useState, useEffect } from 'react';

export function useMentors() {
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMentors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/mentors');
      
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      
      const data = await response.json();
      setMentors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching mentors:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addMentor = async (mentor) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(mentor)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add mentor');
      }
      
      const newMentor = await response.json();
      setMentors([...mentors, newMentor]);
      return newMentor;
    } catch (err) {
      console.error('Error adding mentor:', err);
      throw err;
    }
  };
  
  const updateMentor = async (mentor) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/mentors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(mentor)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update mentor');
      }
      
      const updatedMentor = await response.json();
      setMentors(mentors.map(m => m.id === mentor.id ? updatedMentor : m));
      return updatedMentor;
    } catch (err) {
      console.error('Error updating mentor:', err);
      throw err;
    }
  };
  
  const deleteMentor = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/mentors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete mentor');
      }
      
      setMentors(mentors.filter(m => m.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting mentor:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchMentors();
  }, []);
  
  return {
    mentors,
    isLoading,
    error,
    fetchMentors,
    addMentor,
    updateMentor,
    deleteMentor
  };
}