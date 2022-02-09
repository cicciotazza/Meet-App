import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations } from './api';
import { ErrorAlert, WarningAlert } from './Alert';

import './nprogress.css';

export class App extends Component {

  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    currentLocation: "all"
  };

  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({
          events: events.slice(0, this.state.numberOfEvents),
          locations: extractLocations(events)
        });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, eventCount) => {
    getEvents().then((events) => {
      const locationEvents = (location === "all")
        ? events
        : events.filter((event) => event.location === location);
      const eventsToShow = locationEvents.slice(0, this.state.numberOfEvents);
      if (this.mounted) {
        this.setState({
          events: eventsToShow,
          currentLocation: location
        });

      }
    });
  };

  updateNumberOfEvents = async (e) => {
    const newNumber = e.target.value ? parseInt(e.target.value) : 32;
    if (newNumber < 1 || newNumber > 32) {
      await this.setState({
        numberOfEvents: newNumber,
        errorText: 'Please select between 1 and 32'
      });
    } else {
      await this.setState({
        errorText: '',
        numberOfEvents: newNumber
      });
      this.updateEvents(this.state.currentLocation, this.state.numberOfEvents);
    }
  };

  render() {
    return (
      <div className="App">
        <h1>Meet-App</h1>
        <h4>Select one city</h4>

        {!navigator.onLine ? (<WarningAlert text='Offline mode! List not updated' />) : (<WarningAlert text=' ' />)}

        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />

        <EventList events={this.state.events} />

        <NumberOfEvents numberOfEvents={this.state.numberOfEvents} updateNumberOfEvents={this.updateNumberOfEvents} errorText={this.state.errorText} />
        <h4>Events in each city</h4>

      </div>
    );
  }
}

export default App;