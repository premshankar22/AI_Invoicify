import React from 'react';
import { Card, CardContent, CardHeader, Box } from '@mui/material';

const CustomCard = ({ title, component }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      <CardHeader 
        title={title} 
        sx={{ bgcolor: '#1e3c72', color: 'white', fontWeight: 'bold', textAlign: 'center' }} 
      />
      <CardContent>
        <Box>{component}</Box>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
