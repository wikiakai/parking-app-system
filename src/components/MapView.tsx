import { TouchApp, ZoomIn, ZoomOut, ZoomOutMap } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useTheme,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';
import useStorage from '../hooks/useStorage';
import { SpotType } from '../types/Spot';

interface MapViewProps {
  onSpotSelect?: (name: string) => void;
}

export default function MapView({ onSpotSelect }: MapViewProps) {
  const theme = useTheme();
  const storage = useStorage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 650 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filterKey, setFilterKey] = useState<'N' | 'S' | 'All'>('All');
  const [filterSize, setFilterSize] = useState<'S' | 'M' | 'L' | 'All'>('All');

  const initialSpotsRef = useRef<SpotType[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions((prev) => ({
        width: containerRef.current?.clientWidth || prev.width,
        height: 300,
      }));
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sizeTypes: Array<'S' | 'M' | 'L'> = ['S', 'M', 'L'];
  const sizeDimensions = { S: [70, 110], M: [90, 130], L: [110, 170] };
  const spotCounts = { S: 8, M: 7, L: 6 };
  const orders = storage.getOrders();

  if (initialSpotsRef.current.length === 0) {
    initialSpotsRef.current = sizeTypes.flatMap((size, y) => {
      const [spotWidth, spotHeight] = sizeDimensions[size];
      const totalSpots = spotCounts[size];
      const totalSpacing = 400 - totalSpots * spotWidth;
      const spacing = totalSpacing / (totalSpots + 1) + 50;

      return Array.from({ length: totalSpots }, (_, x) => {
        const name = `${size}-${x + 1}`;
        return {
          x: spacing + x * (spotWidth + spacing),
          y: (y + 0.2) * (spotHeight + 30),
          width: spotWidth,
          height: spotHeight,
          name,
          occupied: orders.some((order) => order.spot === name),
          size,
        } satisfies SpotType;
      });
    });
  }

  const allSpots = [
    ...initialSpotsRef.current.map((spot) => {
      const mergedName = `N-${spot.name}`;
      return {
        ...spot,
        key: 'N',
        y: spot.y,
        occupied: orders.some((order) => order.spot === mergedName),
      };
    }),
    ...initialSpotsRef.current.map((spot) => {
      const mergedName = `S-${spot.name}`;
      return {
        ...spot,
        key: 'S',
        y: spot.y + 10,

        occupied: orders.some((order) => order.spot === mergedName),
      };
    }),
  ];

  const filteredSpots = allSpots.filter(
    (spot) =>
      (filterKey === 'All' || spot.key === filterKey) &&
      (filterSize === 'All' || spot.size === filterSize),
  );

  console.log(allSpots[0]);
  return (
    <Box
      ref={containerRef}
      position="relative"
      p={2}
      borderRadius={2}
      boxShadow={2}
    >
      <Stack spacing={2} direction="row" mb={2}>
        <Stack>
          <Typography variant="h6" fontSize={16}>
            Select parking area
          </Typography>
          <Select
            variant="outlined"
            value={filterKey}
            size="small"
            onChange={(e) => setFilterKey(e.target.value as 'N' | 'S' | 'All')}
          >
            <MenuItem value={'All'}>All</MenuItem>
            <MenuItem value="N">North</MenuItem>
            <MenuItem value="S">South</MenuItem>
          </Select>
        </Stack>
        <Stack>
          <Typography variant="h6" fontSize={16}>
            Select parking size
          </Typography>
          <Select
            variant="outlined"
            value={filterSize}
            size="small"
            onChange={(e) =>
              setFilterSize(e.target.value as 'S' | 'M' | 'L' | 'All')
            }
          >
            <MenuItem value={'All'}>All</MenuItem>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <Stage
        width={dimensions.width}
        height={650}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        draggable
      >
        <Layer>
          {['N', 'S'].map(
            (areaKey) =>
              (filterKey === 'All' || filterKey === areaKey) && (
                <Group key={areaKey} y={areaKey === 'N' ? 10 : 800}>
                  <Text
                    text={areaKey === 'N' ? 'North Area' : 'South Area'}
                    x={50}
                    y={0}
                    fontSize={16}
                    fontStyle="bold"
                  />
                  {filteredSpots
                    .filter((spot) => spot.key === areaKey)
                    .map((spot) => (
                      <Group
                        key={`${areaKey}-${spot.name}`}
                        onClick={() =>
                          !spot.occupied &&
                          onSpotSelect?.(`${areaKey}-${spot.name}`)
                        }
                      >
                        <Rect
                          x={spot.x}
                          y={spot.y}
                          width={spot.width}
                          height={spot.height}
                          fill={
                            spot.occupied
                              ? theme.palette.grey[400]
                              : theme.palette.primary.main
                          }
                          cornerRadius={10}
                        />
                        <Text
                          text={`${areaKey}-${spot.name}`}
                          x={spot.x}
                          y={spot.y}
                          width={spot.width}
                          height={spot.height}
                          align="center"
                          verticalAlign="middle"
                          fontSize={18}
                          fill={
                            spot.occupied ? theme.palette.grey[700] : '#fff'
                          }
                          fontStyle="bold"
                        />
                      </Group>
                    ))}
                </Group>
              ),
          )}
        </Layer>
      </Stage>
      <Grid
        container
        spacing={2}
        mt={2}
        justifyContent="center"
        alignItems={'center'}
      >
        <Grid item>
          <Stack direction="row" alignItems="center">
            <Box
              width={24}
              height={24}
              bgcolor={theme.palette.primary.main}
              borderRadius={1}
            />
            <Typography ml={1}>Available</Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Stack direction="row" alignItems="center">
            <Box
              width={24}
              height={24}
              bgcolor={theme.palette.grey[400]}
              borderRadius={1}
            />
            <Typography ml={1}>Occupied</Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Button
            onClick={() => setZoomLevel((zoom) => zoom + 0.1)}
            variant="contained"
            size="small"
          >
            <ZoomIn />
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => setZoomLevel((zoom) => zoom - 0.1)}
            variant="contained"
            size="small"
          >
            <ZoomOut />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
