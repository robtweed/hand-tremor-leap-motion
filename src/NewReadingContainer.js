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
var Leap = require('leapjs');
var fft = require('jsfft');
//var complex_array = require('complex_array');

var DisplayGraph = require('./DisplayGraph');
var DisplayButton = require('./DisplayButton');
var DisplayText = require('./DisplayText');
var DisplayAnalysis = require('./DisplayAnalysis');

var {
  Panel
} = ReactBootstrap;

var TestContent = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-SessionsPanel')(this.props.controller, this);
    this.showText = true;
    this.showGraph = false;
    this.showGraphButton = false;
    this.graph = '';
    this.showStartReadingBtn = true;
    this.showAnalysisBtn = false;
    this.showAnalysis = false;
    this.showAbortBtn = false;
    this.previousData = false;
    this.defaultText = 'Recording will being 3 seconds after clicking the Start button';
    this.displayText = this.defaultText;
    this.analysis = {};

  },

  componentDidMount: function() {

    this.recordingEnabled = false;
    this.leapController = new Leap.Controller({
      enableGestures: true,
      loopWhileDisconnected: false
    });
    console.log('Leap controller loaded');
    var self = this;

    this.leapController.on('connect', function() {
      console.log('leapMotion controller connected');
      var frameCount = 0;
      self.datasets = {
        x: [],
        y: [],
        z: [],
        roll: []
      };
      var frame1;
      self.leapCycle = setInterval(function(){
        var frame = self.leapController.frame();
        if (frame.valid && frame.hands.length > 0) {
          if (!frame1) frame1 = frame;
          //console.log('started receiving frames');

          var hand = frame.hands[0];
          var position = hand.palmPosition;
          var roll = hand.roll(frame1);
          var dataPoints = [position[0], position[1], position[2], roll];

          //console.log('velocity: ' + JSON.stringify(velocity));
          //var line = '[' + position[0] + ',' + position[1] + ',' + position[2] + ',' + angle + '],\r\n';
          //$('#sample').append(line);
          if (self.recordingEnabled) {
            self.datasets.x.push(position[0]);
            self.datasets.y.push(position[1]);
            self.datasets.z.push(position[2]);
            self.datasets.roll.push(roll);
            //console.log('dataPoints: ' + JSON.stringify(dataPoints));
            self.updatePlot(dataPoints);
            frameCount++;
          }
          //console.log('frameCount: ' + frameCount);
          if (frameCount > 200) self.stopRecording();
        }
      }, 50);
    });

    this.leapController.on('disconnect', function() {
      clearInterval(self.leapCycle);
      //$('#stream').append(']\r\n');
    });

  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  countdown: function(sec) {
    this.displayText = (
      <div>
        Recording will begin in 
        <h2>{sec}</h2>
        seconds...
      </div>
    );
    this.setState({status: 'updated'});
  },

  analyse: function() {
    console.log('Show analysis!!');

    /*
    * Function to get the dominant amplitude and frequency of vibration data. 
    * This really only works if the vibration is similar to a sine wave with one frequency
      (rather than multiple sine waves on top of each other)
    * Also the sampling rate needs to be high enough to capture the wave clearly.
    */

    function getDominantAmpAndFreq(data, samplingRate) {
      var spec = getFullFrequencySpectrum(data, samplingRate);
      // find the maximum amplitude and work out the frequency at that point
      var maxAmp = 0;
      var maxFreq = 0;
      for (var i = 0; i < spec.amps.length; i++) {
        if (spec.amps[i] > maxAmp) {
          maxAmp = spec.amps[i];
          maxFreq = spec.freqs[i];
        }
      }
      // return an object containing the dominant frequency and its amplitude
      var ampAndFreq = {};
      ampAndFreq.amp = maxAmp;
      ampAndFreq.freq = maxFreq;

      return ampAndFreq;
    }

    /*
    * Function to get the full specturm of amplitude against frequency data. 
    */

    function getFullFrequencySpectrum(data, samplingRate) {
      var fftAmps = getFFTAmplitudes(data, samplingRate);

      // find the maximum amplitude and work out the frequency at that point

      var num = (fftAmps.length-1) % 2 === 0 ? (fftAmps.length-1) / 2 : fftAmps.length / 2;

      var amplitudes = new Array(num - 5);
      var frequencies = new Array (num - 5);
      for (var i = 5; i < num; i++) {
        amplitudes[i] = fftAmps[i];
        frequencies[i] = i / (samplingRate / 1000 * data.length);
      }

      // return an object containing an array of frequencies and their amplitudes
      var obj = {
        freqs: frequencies,
        amps: amplitudes
      };

      //console.log('full freq spectrum: ' + JSON.stringify(obj));

      return obj;
    }

    function getFFTAmplitudes(data, samplingRate) {
      // create a complex array of the length of the data

      var complex = new fft.ComplexArray(data.length).map((value, i, n) => {
        value.real = data[i];
      });

      // perform a Fast Fourier Transform

      var freqs = complex.FFT()
      // Calculate the amplitudes at each frequency
      var amps = new Array(freqs.length);
      for (var i = 0; i < freqs.length; i++) {
        amps[i] = (Math.sqrt(freqs.imag[i] * freqs.imag[i] + freqs.real[i] * freqs.real[i])) * samplingRate/data.length;
      }
      console.log('amplitudes: ' + JSON.stringify(amps));
      return amps;
    }

    function analyseSet(dataArray) {
      var length = dataArray.length;
      var sampleArray = dataArray.slice(10, length-10);
      var results = getDominantAmpAndFreq(sampleArray, 50);
      return results;
    }

    this.analysis.x = analyseSet(this.datasets.x);
    this.analysis.y = analyseSet(this.datasets.y);
    this.analysis.z = analyseSet(this.datasets.z);
    this.analysis.roll = analyseSet(this.datasets.roll);
    this.analysis.roll.amp = this.analysis.roll.amp * (180 / Math.PI);
    
    this.showText = false;
    this.showGraph = false;
    this.showGraphBtn = true;
    this.showAnalysisBtn = false;
    this.showAnalysis = true;
    this.setState({status: 'updated'});

  },

  displayGraph: function() {
    this.showAnalysisBtn = true;
    this.showAnalysis = false;
    this.showGraphBtn = false;
    this.showGraph = true;
    this.showText = false;
    this.setState({status: 'updated'});
  },

  abortReading: function() {
    this.showText = true;
    this.showGraph = false;
    this.showStartReadingBtn = true;
    this.showAnalysisBtn = false;
    this.showAnalysis = false;
    this.showAbortBtn = false;
    this.displayText = this.defaultText;
    this.leapController.disconnect();

    if (this.previousData) {
      this.data = this.previousData;
      this.showAnalysisBtn = true;
      this.showGraph = true;
      this.showText = false;
    }

    this.setState({status: 'updated'});
  },

  startNewReading: function() {
    this.showText = true;
    this.showGraph = false;
    this.showAnalysis = false;
    this.showStartReadingBtn = false;
    this.showAnalysisBtn = false;
    this.countdown(3);
    var self = this;
    setTimeout(function() {
      self.countdown(2);
    }, 1000);
    setTimeout(function() {
      self.countdown(1);
    }, 2000);
    setTimeout(function() {
      self.countdown(0);
      self.startRecording();
    }, 3000);
  },

  startRecording: function() {
    this.showText = false;
    this.showStartReadingBtn = false;
    this.showAnalysisBtn = false;
    this.showAbortBtn = true;
    this.startPlot();
    this.setState({status: 'updated'});
    this.leapController.connect();
    this.recordingEnabled = true;   
  },

  stopRecording: function() {
    //console.log(new Date().getTime());
    this.recordingEnabled = false;
    this.showStartReadingBtn = true;
    this.showAnalysisBtn = true;
    this.showAnalysis = false;
    this.showAbortBtn = false;
    this.setState({status: 'updated'});

    this.leapController.disconnect();
    var date = new Date();
    var obj = {
      //patientName: $('#patientName').val(),
      date: date.getTime(),
      data: this.datasets
    };
    this.previousData = this.data;
    //lastDataset = obj;
    //$('#startBtn').text("Start New Reading");
    //$('#startBtn').collapse('show');
    //$('#saveBtn').collapse('show');
    //$('#countdownBox').text('Recording finished!');
    //EWD.application.showResults();
    console.log('recording finished');
    //console.log(JSON.stringify(obj));
  },

  startPlot: function() {
    this.options = {
      xaxis: {
        min: 0,
        max: 10,
        axisLabel: "Time",
        axisLabelFontSizePixels: 12,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10
      }
    };

    this.data = [
      {data: [0, 0], label: 'x'},
      {data: [0, 0], label: 'y'},
      {data: [0, 0], label: 'z'},
      {data: [0, 0], label: 'roll'}
    ];

    this.time = 0;
    this.showGraph = true;
    this.setState({status: 'updated'});
  },

  updatePlot: function(newData) {
    //console.log('update plot with new data ' + JSON.stringify(newData));
    var plotArray = this.data;
    var xArray = plotArray[0].data;
    var yArray = plotArray[1].data;
    var zArray = plotArray[2].data;
    var rollArray = plotArray[3].data;
    this.time = this.time + 0.05;
    xArray.push([this.time, newData[0]]);
    yArray.push([this.time, newData[1]]);
    zArray.push([this.time, newData[2]]);
    rollArray.push([this.time, newData[3] * 57]);
    this.data = [
      {data: xArray, label: 'x'},
      {data: yArray, label: 'y'},
      {data: zArray, label: 'z'},
      {data: rollArray, label: 'roll'}
    ];
    this.setState({status: 'updated'});
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);
    //console.log('re-rendering!!');
    //console.log('this.data is now: ' + JSON.stringify(this.data));
    //console.log('this.options is now: ' + JSON.stringify(this.options));
    //console.log('this.showGraph = ' + this.showGraph);

    this.title = (
      <span>
        <DisplayButton
          show = {this.showAbortBtn} 
          bsStyle="warning"
          onClick = {this.abortReading}
          text = "Abort"
        />
        <DisplayButton
          show = {this.showStartReadingBtn} 
          bsStyle="success"
          onClick = {this.startNewReading}
          text = "Start Reading"
        />
        <DisplayButton
          show = {this.showAnalysisBtn} 
          bsStyle="success"
          onClick = {this.analyse}
          text = "Show Analysis"
        />
        <DisplayButton
          show = {this.showGraphBtn} 
          bsStyle="success"
          onClick = {this.displayGraph}
          text = "Show Graph"
        />
      </span>
    );

    return (
      <Panel
        header={this.title}
        bsStyle="info"
      >

        <DisplayText
          show = {this.showText}
          text = {this.displayText}
        />

        <DisplayGraph
          show = {this.showGraph}
          options = {this.options}
          data = {this.data}
        />

        <DisplayAnalysis
          show = {this.showAnalysis}
          data = {this.analysis}
        />

      </Panel>
    );
  }
});

module.exports = TestContent;
