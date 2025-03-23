import { Stack } from '@mui/material';
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
  const { setMsg } = useContext(AppContext);
  const storage = useStorage();

  const [selected, setSelected] = useState('');

  const orders = storage.getOrders();

  console.log(orders);
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
            {orders.map((row, index) => (
              <TableData row={row} index={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
