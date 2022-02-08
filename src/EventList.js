import React, { Component } from 'react';
import Event from './Event';

class EventList extends Component {
  render() {
    const { events } = this.props;

    return (
      <ul className="EventList">
        {events.length === 0 &&
          <div>
            <h3>...Loading...</h3>
          </div>}
        {events.map(event =>
          <li key={event.id}>
            <Event event={event} />
          </li>
        )}
      </ul>
    );
  };
}

export default EventList;