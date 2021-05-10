import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { h0, h1} from '../tools';

import './DateSelector.css';

function Day(props) {
  const { day, onSelect } = props;

  if (!day) {
    return <td className="null"></td>;
  }

  const classes = [];

  const now = h0();

  if (day < now) {
    classes.push('disabled');
  }

  if ([6, 0].includes(new Date(day).getDay())) {
    classes.push('weekend');
  }

  const dateString = now === day ? '今天' : new Date(day).getDate();

  return (
    <td 
      className={classnames(classes)} 
      onClick={() => onSelect(day)}
    >
      {dateString}
    </td>
  );
}

Day.propTypes = {
  day: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
};

function Week(props) {
  const { days, onSelect } = props;

  return (
    <tr className="date-table-days">
      {days.map((day, idx) => {
          return <Day key={idx} day={day} onSelect={onSelect} />;
      })}
    </tr>
  );
}

Week.propTypes = {
  days: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

function Month(props) {
  const { startingTimeInMonth, onSelect, block } = props;
  const startDay = new Date(startingTimeInMonth);
  const currentDay = new Date(startingTimeInMonth);
  let days = [];
//currentDay.getMonth() === startDay.getMonth()
  while (days.length !== (21 - block)) {
    days.push(currentDay.getTime());
    currentDay.setDate(currentDay.getDate() + 1);
      //console.log(currentDay.getMonth())
  }
  days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
      .fill(null)
      .concat(days);

  //const lastDay = new Date(days[days.length - 1]);

  // days = days.concat(
  //     new Array(lastDay.getDay() ? 7 - lastDay.getDay() : 0).fill(null)
  // );

  const weeks = [];

  for (let row = 0; row < days.length / 7; ++row) {
    const week = days.slice(row * 7, (row + 1) * 7);
    weeks.push(week);
  }

  return (
    <table className="date-table">
      <thead>
        <tr>
          <td colSpan="7">
            <h5>
              {new Date().getFullYear()}年{new Date().getMonth() + 1}月
            </h5>
          </td>
        </tr>
      </thead>
        <tbody>
          <tr className="data-table-weeks">
            <th className="date-table-th">周一</th>
            <th className="date-table-th">周二</th>
            <th className="date-table-th">周三</th>
            <th className="date-table-th">周四</th>
            <th className="date-table-th">周五</th>
            <th className="weekend">周六</th>
            <th className="weekend">周日</th>
          </tr>
          {weeks.map((week, idx) => {
            return <Week 
              key={idx} 
              days={week} 
              onSelect={onSelect} 
            />;
          })}
        </tbody>
    </table>
  );
}

Month.propTypes = {
  startingTimeInMonth: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
  const { onSelect } = props;

  const now = new Date();
  const date = new Date().getDate();
  const which = new Date().getDay();

  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);

  const {day, block} = h1(date, which)

  now.setDate(day);

  const monthSequence = [now.getTime()];

  // now.setMonth(now.getMonth() + 1);
  // monthSequence.push(now.getTime());

  // now.setMonth(now.getMonth() + 1);
  // monthSequence.push(now.getTime());

  return (
    <div className={classnames('date-selector')}>
      <div className="date-selector-tables">
        {monthSequence.map(month => {
          return (
            <Month
              key={month}
              onSelect={ onSelect }
              startingTimeInMonth={month}
              block={block}
            />
          );
        })}
      </div>
    </div>
  );
}

DateSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
};