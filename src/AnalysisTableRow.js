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

var AnalysisTableRow = React.createClass({

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

    return (
      <tr>
        <td>{this.props.axis}</td>
        <td>{this.props.amplitude}</td>
        <td>{this.props.frequency}</td>
      </tr>
    );
  }
});

module.exports = AnalysisTableRow;
