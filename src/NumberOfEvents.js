import React, { Component } from 'react';
import { ErrorAlert } from './Alert';

export class NumberOfEvents extends Component {

    render() {
        return (
            <div className="NumberOfEvents">
                <ErrorAlert text={this.props.errorText} />
                <input type="number" className="number"
                    min="1" max="100"
                    value={this.props.numberOfEvents}
                    onChange={(e) => this.props.updateNumberOfEvents(e)} />
            </div>
        )
    }
};

export default NumberOfEvents;