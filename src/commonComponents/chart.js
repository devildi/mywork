import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { color } from '../tools'

const filterUser = (arr) => {
  if(arr){
    let arr1 = Object.keys(arr[0])
    let arr2 = arr1.filter(i => i !== 'name')
    return arr2
  } else return null
}

const useStyles = makeStyles(theme => ({
  root:{
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: 'center',
  },
}));

export default function Chart ({data, width}) {
  //console.log(data)
  const classes = useStyles();
  return (
    <React.Fragment>
    {
      filterUser(data)
      ?<LineChart
        width={width}
        height={200}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {
          filterUser(data).map((i) => {
            return (
              <Line 
                type="monotone" 
                key={i}
                dataKey={i} 
                stroke={color()}
              />
            )
          })
        }
      </LineChart>
      :<div className={classes.root}>
        暂无数据
      </div>
    }
    </React.Fragment>
  )
}
