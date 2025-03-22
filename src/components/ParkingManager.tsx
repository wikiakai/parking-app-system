import { Card, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import useStorage from '../hooks/useStorage';
import { AppContext } from '../App';
import { Order } from '../types/Order';
import OrderDialog from './OrderDialog';
import MapView from './MapView';

export default function ParkingManager() {
  const { setMsg } = useContext(AppContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState('');
  const storageHandler = useStorage();

  const handleSpotSelection = (spot: string) => {
    setSelectedSpot(spot);
    setIsDialogOpen(true);
  };

  const handleOrderSubmission = (order?: Order) => {
    setIsDialogOpen(false);

    if (!order) {
      return;
    }

    storageHandler.addOrder(order);
    setMsg?.(`${order.spot} has been successfully reserved.`);
  };

  return (
    <>
      <Card sx={{ mt: 2, boxShadow: 4 }}>
        <MapView onSpotSelect={handleSpotSelection} />
      </Card>

      <OrderDialog
        open={isDialogOpen}
        selectedSpot={selectedSpot}
        onClose={handleOrderSubmission}
      />
    </>
  );
}
