import React from 'react';
import Days from '../commonComponents/DateSelector'
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2,2,0,2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
  div: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    
  },
  div1: {
  	padding: theme.spacing(0.5),
  	marginBottom: theme.spacing(2),
  	border:'1px solid #f0f0f0',
    borderRadius: theme.spacing(1),
    backgroundColor: '#f0f0f0'
  },
  head: {
  	textAlign: 'center'
  },
  chip: {
    margin: theme.spacing(0.5, 0.5, 0.5 ,0),
  }
}));

function Data ({arr}){
	const classes = useStyles();
	return (
		<div className={classes.div}>
  	{
  		arr.map((i,index) => {
  			return(
  				<div className={classes.div1}>
  					<Typography 
  						variant="h6" 
  						component="h2"
  						className={classes.head}
		      		key={index}
  					>
              {`2月10日排班：`}
            </Typography>
		      	<div>
		      		{
		      			i.list.map((row,index1) => (
		      				<Chip 
		                color="primary"
		                key={index1}
		                label={'item.name'} 
		                className={classes.chip}
		                variant={'outlined'}
		              />
		      			))
		      		}
		      	</div>
	      	</div>
  			)
  		})
  	}
  	</div>
	)
}

function Arrange({onSelect}) {
	
	let arr1 = []

  return (
    <div>
      <Days onSelect={onSelect}/>
      {
      	arr1 && arr1.length > 0 ? <Data arr={arr1}/> : null
      }
    </div>
  );
}

export default Arrange;