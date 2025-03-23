/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import {
  TableRow,
  TableCell,
  Chip,
  Button,
  DialogTitle,
  Dialog,
  Typography,
  Box,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Order } from '../types/Order';
import dayjs from 'dayjs';
import { AppContext } from '../App';
import useStorage from '../hooks/useStorage';

interface TableDataProps {
  row: Order;
  index: number;
}
export const TableData = ({ row, index }: TableDataProps) => {
  const { setMsg } = useContext(AppContext);

  const startDate = dayjs(row.date);
  const endDate = dayjs(row.date).add(row.duration, 'hours');
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(endDate.diff(dayjs()));
  useEffect(() => {
    const interval = setInterval(
      () => setRemaining(endDate.diff(dayjs())),
      1000,
    );

    return () => clearInterval(interval);
  }, []);

  const overtime = remaining < 0;
  const ms = overtime ? -remaining : remaining;

  const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const timer = [hours, minutes, seconds].join(':');

  const storage = useStorage();

  const handleEnd = (spot: string) => {
    storage.removeOrder(spot);
    setMsg?.(`${spot} successfully ended`);
    setOpen(false);
  };

  return (
    <>
      <TableRow
        key={index}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {index + 1}
        </TableCell>

        <TableCell component="th" scope="row">
          <Chip label={row.spot} color="secondary" />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>
          <Typography color={overtime ? 'error' : 'primary'}>
            {timer}{' '}
          </Typography>
        </TableCell>
        <TableCell>
          <Button onClick={() => setOpen(true)}>Detail</Button>
        </TableCell>
      </TableRow>

      <Dialog
        fullWidth
        open={open}
        keepMounted={false}
        onClose={() => setOpen(false)}
      >
        <DialogTitle padding={0}>
          Reservation Details{' '}
          <Typography
            component="span"
            fontSize={20}
            fontWeight="bold"
            color="primary"
          >
            {row.spot}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
            }}
          >
            <Typography fontSize={18} variant="h6" gutterBottom></Typography>
            <Box sx={{ marginBottom: 2 }}>
              <Typography fontSize={18} variant="h6">
                <strong>Name:</strong> {row.name}
              </Typography>
              <Typography fontSize={18} variant="h6">
                <strong>Duration:</strong> {row.duration} Hour(s)
              </Typography>
              <Typography fontSize={18} variant="h6">
                <strong>Start Date:</strong>{' '}
                {startDate.format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography fontSize={18} variant="h6">
                <strong>End Date:</strong> {endDate.format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography fontSize={18} variant="h6">
                <strong>
                  {overtime ? 'Overtime' : 'Remaining'} : {'  '}
                </strong>
                <Chip
                  label={timer}
                  size="small"
                  color={overtime ? 'error' : 'primary'}
                />
              </Typography>
              <Typography fontSize={18} variant="h6">
                <strong>Overtime :</strong> {overtime ? 'Yes' : 'No'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ paddingX: 3, paddingBottom: 3 }}>
          <Button variant="contained" onClick={() => handleEnd(row.spot)}>
            End Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
