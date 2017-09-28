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

var reactLoader = require('qewd-react').loader;

var params = {
  applicationName: 'tremor2',
  MainPage: require('./MainPage'),
  log: true,
  config: {
    title: 'Hand Tremor - Leap Motion',
    loginModal: false,
    /*
    loginModal: {
      title: 'Login to Content Store',
      username: {
        label: 'User Name',
        placeholder: 'Enter User Name'
      }
    },
    */
    shutdown: {
      buttonText: 'Restart'
    },
    navs: [
      {
        text: 'New Reading',
        eventKey: 'newReading',
        default: true,  // default=true to make this display by default
        panel: {
          title: 'Take and Analyse a New Reading',
          contentComponent: require('./NewReadingContainer')
        }
      },
      /*
      {
        text: 'Previous Readings',
        eventKey: 'previousReadings',
        panel: {
          title: 'View Previous Readings',
          initiallyExpanded: true
        }
      }
      */
    ],
    local: true
  }
};

reactLoader(params);
