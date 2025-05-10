import { useState, useEffect } from 'react';

export function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/materials');
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching materials:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addMaterial = async (material) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(material)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add material');
      }
      
      const newMaterial = await response.json();
      setMaterials([...materials, newMaterial]);
      return newMaterial;
    } catch (err) {
      console.error('Error adding material:', err);
      throw err;
    }
  };
  
  const updateMaterial = async (material) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/materials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(material)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update material');
      }
      
      const updatedMaterial = await response.json();
      setMaterials(materials.map(m => m.id === material.id ? updatedMaterial : m));
      return updatedMaterial;
    } catch (err) {
      console.error('Error updating material:', err);
      throw err;
    }
  };
  
  const deleteMaterial = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      const response = await fetch('/api/materials', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete material');
      }
      
      setMaterials(materials.filter(m => m.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting material:', err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchMaterials();
  }, []);
  
  return {
    materials,
    isLoading,
    error,
    fetchMaterials,
    addMaterial,
    updateMaterial,
    deleteMaterial
  };
}