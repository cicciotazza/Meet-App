import React, { Component } from 'react';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import { WarningAlert } from './Alert';
import WelcomeScreen from './WelcomeScreen';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EventGenre } from './EventGenre';

import './nprogress.css';
import './App.css';

export class App extends Component {

  state = {
    events: [],
    locations: [],
    numberOfEvents: 32,
    currentLocation: "all",
    warningText: '',
    showWelcomeScreen: undefined,
    isOnline: true
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if (code || (isTokenValid && this.mounted)) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            events: events.slice(0, this.state.numberOfEvents),
            locations: extractLocations(events)
          });
        }
      });
    } if (!navigator.onLine) {
      this.setState({
        isOnline: false,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, eventCount = this.state.numberOfEvents) => {
    this.setState({ isOnline: navigator.onLine ? true : false });
    getEvents().then((events) => {
      const locationEvents = (location === 'all')
        ? events
        : events.filter((event) => event.location === location);
      if (this.mounted) {
        this.setState({
          events: locationEvents.slice(0, eventCount),
          location: location,
          currentLocation: location
        });
      }
    });
  };

  updateNumberOfEvents = async (e) => {
    const newNumber = e.target.value ? parseInt(e.target.value) : 64;
    if (newNumber < 1 || newNumber > 64) {
      await this.setState({
        numberOfEvents: newNumber,
        errorText: 'Please select between 1 and 64'
      });
    } else {
      await this.setState({
        errorText: '',
        numberOfEvents: newNumber
      });
      this.updateEvents(this.state.currentLocation, this.state.numberOfEvents);
    }
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return { city, number };
    })
    return data;
  };

  render() {
    const { events } = this.state;
    if (this.state.showWelcomeScreen === undefined) { return <div className="App" /> }
    if (this.state.showWelcomeScreen === false) {
      return (
        <div className="App">
          <h1 className="page-title">Meet-App</h1>
          <h3 className="page-subtitle">Coding is passion, join one event!</h3>

          {!navigator.onLine ? (<WarningAlert text='Offline mode! List not updated' />) : (<WarningAlert text=' ' />)}

          <CitySearch
            locations={this.state.locations}
            updateEvents={this.updateEvents} />

          <NumberOfEvents
            numberOfEvents={this.state.numberOfEvents}
            updateNumberOfEvents={this.updateNumberOfEvents}
            errorText={this.state.errorText} />
          <h4 className='textNumberOfEvents'>Events in each city</h4>

          <div className="chart-2">
            <div className='data-vis-wrapper'>
              <EventGenre events={events} />
              <ResponsiveContainer height={400} >
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="category" dataKey="city" name="city" />
                  <YAxis type="number" dataKey="number" name="number of events" allowDecimals={false} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={this.getData()} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/*  <EventList events={this.state.events} />   */}

          <EventList
            events={this.state.events} />

        </div>
      )
    }

    if (this.state.showWelcomeScreen === true) {
      return (
        <div className="App">
          <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen} getAccessToken={() => { getAccessToken() }} />
        </div>);
    }
  }
}

export default App;