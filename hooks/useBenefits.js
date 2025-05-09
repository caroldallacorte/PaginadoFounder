import { useState, useEffect } from 'react';

export function useBenefits(category) {
  const [benefits, setBenefits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchBenefits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/benefits/${category}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch benefits');
      }
      
      const data = await response.json();
      setBenefits(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching benefits:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addBenefit = async (benefit) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch(`/api/benefits/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(benefit)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add benefit');
      }
      
      const newBenefit = await response.json();
      setBenefits([...benefits, newBenefit]);
      return newBenefit;
    } catch (err) {
      console.error('Error adding benefit:', err);
      throw err;
    }
  };
  
  const updateBenefit = async (benefit) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch(`/api/benefits/${category}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(benefit)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update benefit');
      }
      
      const updatedBenefit = await response.json();
      setBenefits(benefits.map(b => b.id === benefit.id ? updatedBenefit : b));
      return updatedBenefit;
    } catch (err) {
      console.error('Error updating benefit:', err);
      throw err;
    }
  };
  
  const deleteBenefit = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch(`/api/benefits/${category}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete benefit');
      }
      
      setBenefits(benefits.filter(b => b.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting benefit:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    if (category) {
      fetchBenefits();
    }
  }, [category]);
  
  return {
    benefits,
    isLoading,
    error,
    fetchBenefits,
    addBenefit,
    updateBenefit,
    deleteBenefit
  };
}