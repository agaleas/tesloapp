import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  currentValue: number;
  maxValue: number;

  //Methods
  updatedValue: (updatedNumber: number) => void;
}

export const ItemCounter: FC<Props> = ({
  currentValue,
  updatedValue,
  maxValue,
}) => {
  const addOrRemove = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return;
      return updatedValue(currentValue - 1);
    }

    if (currentValue >= maxValue) return;
    updatedValue(currentValue + 1);
  };

  return (
    <Box display='flex' alignItems='center'>
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}>
        {' '}
        {currentValue}{' '}
      </Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
