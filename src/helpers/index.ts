import moment from 'moment';

export const getRemoveTime = (time: number, interval: number) => {
  const start = moment();
  const end = moment(time + interval);
  const diff = end.diff(start);
  return moment(diff).format('mm:ss');
};
