import React from 'react';
import DateFnsUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers';

import { createStyles, withStyles, makeStyles } from '@material-ui/core/styles';
import { h0 } from '../tools'
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
}));

function MaterialUIPickers({getDate}) {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = date => {
    setSelectedDate(date);
    getDate(h0(date.$d))
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        value={selectedDate} 
        onChange={handleDateChange}
        autoOk
        variant="inline"
        inputVariant="outlined"
        format="YYYY/MM/DD"
        className={classes.root}
      />
    </MuiPickersUtilsProvider>
  );
}

const styles = createStyles(theme => ({
  
}));

export default withStyles(styles)(MaterialUIPickers);