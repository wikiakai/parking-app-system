import { Alert, Snackbar, Stack, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createContext, useEffect, useState } from 'react';
import ListOrder from './components/ListOrder';
import ParkingManager from './components/ParkingManager';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export const AppContext = createContext<{
  setMsg?: React.Dispatch<React.SetStateAction<string>>;
}>({});

export default function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (msg) {
      const timeOut = setTimeout(() => {
        setMsg('');
      }, 3000);

      return () => clearTimeout(timeOut);
    }
  }, [msg]);

  return (
    <AppContext.Provider value={{ setMsg }}>
      <Container maxWidth="lg" sx={{ minHeight: window.innerHeight }}>
        <Box sx={{ my: 4 }}>
          <Stack direction={'row'} gap={1} mb={2} justifyContent={'center'}>
            <TipsAndUpdatesIcon fontSize="large" color="primary" />
            <Typography variant="h4">Smart parking system</Typography>
          </Stack>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTab}
              onChange={(_, i) => setSelectedTab(i)}
              aria-label="basic tabs example"
            >
              <Tab label="Select Parking Slot" />
              <Tab label="List Order" />
            </Tabs>
          </Box>

          {selectedTab === 0 && <ParkingManager />}
          {selectedTab === 1 && <ListOrder />}
        </Box>
      </Container>

      <Snackbar
        open={!!msg}
        autoHideDuration={3000}
        onClose={() => setMsg('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setMsg('')}>
          {msg}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}
