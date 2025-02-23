import React from 'react';
import { Box, ButtonGroup, Button, Slider, TextField, Typography } from '@mui/material';

const FutureSalesSelector = ({ futureDays, setFutureDays }) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Select Fixed Interval:
      </Typography>
      <ButtonGroup variant="contained" sx={{ marginBottom: 2 }}>
        <Button 
          color={futureDays === 7 ? 'primary' : 'inherit'}
          onClick={() => setFutureDays(7)}
        >
          1 Week
        </Button>
        <Button 
          color={futureDays === 30 ? 'primary' : 'inherit'}
          onClick={() => setFutureDays(30)}
        >
          1 Month
        </Button>
        <Button 
          color={futureDays === 90 ? 'primary' : 'inherit'}
          onClick={() => setFutureDays(90)}
        >
          3 Months
        </Button>
        <Button 
          color={futureDays === 180 ? 'primary' : 'inherit'}
          onClick={() => setFutureDays(180)}
        >
          6 Months
        </Button>
      </ButtonGroup>

      <Typography variant="subtitle1" gutterBottom>
        Or specify a custom number of days:
      </Typography>
      <Box sx={{ width: 300, mb: 1 }}>
        <Slider
          value={futureDays}
          onChange={(e, newValue) => setFutureDays(newValue)}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={7}
          max={180}
        />
      </Box>
      <TextField
        label="Future Days"
        type="number"
        value={futureDays}
        onChange={(e) => setFutureDays(Number(e.target.value))}
        inputProps={{ min: 7, max: 180 }}
        variant="outlined"
        sx={{ width: 100 }}
      />
    </Box>
  );
};

export default FutureSalesSelector;
