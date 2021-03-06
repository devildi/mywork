import React, { useState, useEffect} from 'react';
import Days from '../commonComponents/DateSelector'
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import RemoveIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';
import Grow from '@material-ui/core/Grow';
import '../css/index.css';
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
    paddingBottom: theme.spacing(7)
  },
  div1: {
  	padding: theme.spacing(0.5),
  	marginBottom: theme.spacing(2),
  	border:'1px solid #f0f0f0',
    borderRadius: theme.spacing(1),
    backgroundColor: '#f0f0f0'
  },
  chip: {
    margin: theme.spacing(0.5, 0.5, 0.5 ,0),
  },
  title: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  div2: {
    display: 'flex',
    justifyContent: "center",
    //alignItems: 'center',
    height:'100%'
  },
  div3: {
    height: '100%',
    overflow: 'hidden'
  }
}));

function Data ({arr, toArrange, clearDay}){
  const [showMessage, setShowMessage] = useState(false);
	const classes = useStyles();

  const clearThisDay = (e, index) => {
    e.stopPropagation()
    clearDay(index)
  }

  useEffect(()=>{
    if(arr.length !== 0){
      setShowMessage(true)
    }
  }, [arr.length])

	return (
		<div className={classes.div}>
  	{
  		arr.map((i,index) => {
  			return(
          <Grow
            in={showMessage}
            key={index}
            {...(showMessage ? { timeout: 500 * index } : {})}
          >
    				<div 
              className={classes.div1} 
              key={i.date}
              onClick={() => toArrange(index)}
            > 
              <div className={classes.title}>
      					<Typography 
      						variant="h6" 
      						component="h2"
      					>
                  {`${new Date(i.date).getMonth() + 1}月${new Date(i.date).getDate()}日排班情况：`}
                </Typography>
                <RemoveIcon 
                  className={classes.icon}
                  onClick={(e) => clearThisDay(e,index)}
                />
              </div>
  		      	<div>
  		      		{
  		      			i.list.map((row,index1) => (
  		      				<Chip 
  		                color="primary"
  		                key={row}
  		                label={row} 
  		                className={classes.chip}
  		                variant={'outlined'}
  		              />
  		      			))
  		      		}
  		      	</div>
  	      	</div>
          </Grow>
  			)
  		})
  	}
  	</div>
	)
}

function Arrange({onSelect, arrangeData, toArrange, clearDay}) {
  const classes = useStyles();
  return (
    <div className={classes.div3}>
      <Days onSelect={onSelect}/>
      {
      	arrangeData && arrangeData.length > 0 
        ? <Data 
            arr={arrangeData}
            toArrange={toArrange}
            clearDay={clearDay}
          /> 
        : <div className={classes.div2}>
            暂无数据
          </div>
      }
    </div>
  );
}

export default Arrange;