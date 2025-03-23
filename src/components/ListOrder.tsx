import { Stack, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import useStorage from '../hooks/useStorage';
import { AppContext } from '../App';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableData } from './TableData';

export default function ListOrder() {
  const storage = useStorage();

  const orders = storage.getOrders();

  return (
    <Stack mt={2} spacing={2}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Spot</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No orders available yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {orders.map((row, index) => (
              <TableData row={row} index={index} key={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
