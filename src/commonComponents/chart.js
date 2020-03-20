import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import Skeleton from '@material-ui/lab/Skeleton';

import { color } from '../tools'

const filterUser = (arr) => {
  if(arr){
    let arr1 = Object.keys(arr[0])
    let arr2 = arr1.filter(i => i !== 'name')
    return arr2
  } else return null
}

export default function Chart ({data, width}) {
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
      :<Skeleton variant="rect" width={width} height={200} />
    }
    </React.Fragment>
  )
}
