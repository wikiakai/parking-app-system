import dayjs from 'dayjs';

export type Order = {
  spot: string;
  name: string;
  policeNumber: string;
  duration: number;
  date: dayjs.Dayjs;
};
