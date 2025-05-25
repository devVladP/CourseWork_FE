import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  return React.createElement(Navigate, { to: "/dashboard", replace: true });
};

export default Index;