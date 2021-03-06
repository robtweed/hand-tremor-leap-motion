/*

 ------------------------------------------------------------------------------------
 | hand-tremor-leap-motion: Measuring Hand Tremor Using Leap Motion Controller      |
 |                                                                                  |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                                   |
 | Redhill, Surrey UK.                                                              |
 | All rights reserved.                                                             |
 |                                                                                  |
 | http://www.mgateway.com                                                          |
 | Email: rtweed@mgateway.com                                                       |
 |                                                                                  |
 |                                                                                  |
 | Licensed under the Apache License, Version 2.0 (the "License");                  |
 | you may not use this file except in compliance with the License.                 |
 | You may obtain a copy of the License at                                          |
 |                                                                                  |
 |     http://www.apache.org/licenses/LICENSE-2.0                                   |
 |                                                                                  |
 | Unless required by applicable law or agreed to in writing, software              |
 | distributed under the License is distributed on an "AS IS" BASIS,                |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.         |
 | See the License for the specific language governing permissions and              |
 |  limitations under the License.                                                  |
 ------------------------------------------------------------------------------------

  28 September 2017

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var {
  Table
} = ReactBootstrap;

var AnalysisTableRow = require('./AnalysisTableRow');

var DisplayAnalysis = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
  },

  componentWillReceiveProps: function(newProps) {
  },

  render: function() {

    if (!this.props.show) {
      return (
        <div></div>
      );
    }

    var rows = [];
    var row;
    var unit;

    for (var axis in this.props.data) {
      unit = ' mm';
      if (axis === 'roll') unit = ' degrees';
      row = (
        <AnalysisTableRow
          key = {axis}
          axis = {axis}
          amplitude = {+this.props.data[axis].amp.toFixed(2) + unit}
          frequency = {+this.props.data[axis].freq.toFixed(2)}
        />
      );
      rows.push(row);
    }

    return (
        <Table 
          responsive  
        >
        <thead>
          <tr>
            <th>Axis</th>
            <th>Amplitude</th>
            <th>Frequency (Hz)</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
  }
});

module.exports = DisplayAnalysis;
