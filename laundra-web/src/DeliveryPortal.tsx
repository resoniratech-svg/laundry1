import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from './DatabaseContext';

export const DeliveryPortal: React.FC = () => {
  const navigate = useNavigate();
  const { saveDB } = useDatabase();

  useEffect(() => {
    saveDB({ 
      activeRole: 'Delivery Boy', 
      currentDeliveryBoy: 'John Doe' 
    });
    localStorage.setItem('ll_activerole', 'Delivery Boy');
    localStorage.setItem('ll_active_delivery_boy', 'John Doe');
    localStorage.setItem('ll_active_workspace', 'admin');
    navigate('/admin');
  }, [navigate]);

  return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Redirecting to Delivery Portal...</div>;
};
