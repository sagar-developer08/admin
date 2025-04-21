import * as dayjs from "dayjs";

const showTimeFormat = (data, timeFormat) => {
  return dayjs(data).format(timeFormat);
};

const showDateFormat = (data, dateFormat) => {
  return dayjs(data).format(dateFormat);
};

const showDateTimeFormat = (data, dateFormat = 'MM/DD/YYYY', timeFormat = 'h:mm A') => {
  if (!data) return '-'; // Handle missing date
  
  const date = dayjs(data);
  if (!date.isValid()) return '-'; // Handle invalid dates
  
  return date.format(`${dateFormat} ${timeFormat}`);
};

export { showTimeFormat, showDateFormat, showDateTimeFormat };
