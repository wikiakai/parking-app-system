import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Order } from '../types/Order';

interface OrderDialogProps {
  open: boolean;
  selectedSpot: string;
  onClose: (value?: Order) => void;
}

export default function OrderDialog({
  open,
  selectedSpot,
  onClose,
}: OrderDialogProps) {
  const [orderDetails, setOrderDetails] = useState<Order>({
    spot: selectedSpot,
    name: '',
    policeNumber: '',
    duration: 1,
    date: dayjs(),
  });

  useEffect(() => {
    if (open) {
      setOrderDetails((prev) => ({
        ...prev,
        spot: selectedSpot,
        date: dayjs(),
      }));
    }
  }, [open, selectedSpot]);

  const handleChange = (field: keyof Order, value: string | number) => {
    setOrderDetails((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog fullWidth open={open} keepMounted={false}>
      <DialogTitle>
        Reserve Spot:{' '}
        <Typography
          component="span"
          fontSize={20}
          fontWeight="bold"
          color="primary"
        >
          {selectedSpot}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} width="100%">
          <TextField
            fullWidth
            required
            label="Name"
            value={orderDetails.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Shin Tae Yong"
          />
          <TextField
            fullWidth
            required
            label="Police Number"
            value={orderDetails.policeNumber}
            placeholder="AB 999 XX"
            onChange={(e) => handleChange('policeNumber', e.target.value)}
          />
          <Select
            value={orderDetails.duration}
            onChange={(e) => handleChange('duration', Number(e.target.value))}
          >
            {[...Array(5)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1} hours
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          onClick={() => onClose(orderDetails)}
          disabled={!orderDetails.name || !orderDetails.policeNumber}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
