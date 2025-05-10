import { useState, useEffect } from 'react';

export function useFunds() {
  const [funds, setFunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchFunds = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/funds');
      
      if (!response.ok) {
        throw new Error('Failed to fetch funds');
      }
      
      const data = await response.json();
      setFunds(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching funds:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addFund = async (fund) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(fund)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add fund');
      }
      
      const newFund = await response.json();
      setFunds([...funds, newFund]);
      return newFund;
    } catch (err) {
      console.error('Error adding fund:', err);
      throw err;
    }
  };
  
  const updateFund = async (fund) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/funds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(fund)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update fund');
      }
      
      const updatedFund = await response.json();
      setFunds(funds.map(f => f.id === fund.id ? updatedFund : f));
      return updatedFund;
    } catch (err) {
      console.error('Error updating fund:', err);
      throw err;
    }
  };
  
  const deleteFund = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/funds', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete fund');
      }
      
      setFunds(funds.filter(f => f.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting fund:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchFunds();
  }, []);
  
  return {
    funds,
    isLoading,
    error,
    fetchFunds,
    addFund,
    updateFund,
    deleteFund
  };
}