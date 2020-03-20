import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: '650',
  },
});

export default function SimpleTable({rows}) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple dense table">
        <TableHead>
          <TableRow>
            <TableCell>日期</TableCell>
            <TableCell align="right">镜头</TableCell>
            <TableCell align="right">节目</TableCell>
            <TableCell align="right">描述</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
          rows && rows.length > 0
        ?<React.Fragment>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {`${new Date(row.date).getMonth()+1}月${new Date(row.date).getDate()}日`}
              </TableCell>
              <TableCell align="right">{row.shootnums}</TableCell>
              <TableCell align="right">{row.program}</TableCell>
              <TableCell align="right">{row.des}</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
        :null
        }
          
        </TableBody>
      </Table>
    </TableContainer>
  );
}