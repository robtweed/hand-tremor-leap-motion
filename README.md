# hand-tremor-leap-motion: Hand Tremor Measurement using Leap Motion Controller
 
Rob Tweed <rtweed@mgateway.com>  
28 September 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed


## Installing & Running

A run-time pre-built version of the application is included in the /www folder of this
repository.

Copy the two files you'll find in this folder (index.html & bundle.js) to a directory on your
web server.


The application is completely self-contained and will run in a browser.  You must have a 
Leap Motion controller installer and connected to the machine on which you run the browser.

From the browser, load the index.html file from the web server, eg:

      http://myserver.com/tremor/index.html

The precise URL you'll need to use will, of course, be determined by the IP/Domain name of your
web server and the web server folder into which you copy the build files.


## Source Code

The application has been build using React.js.  The source files are in the /src folder of this
repository.

Most of the work/logic of the application occurs in the module file:

      NewReadingContainer.js


## Re-Bundling the Source Code

If you want to modify / customise the source code, you'll need to re-bundle it using Browserify.

You'll first need to install all the required dependencies.  


### Setting up the Build Environment

The following steps just need carrying out once.

I'm going to assume that you've put the source code files into a folder named ~/node/tremor.  Modify
the steps below to correspond to the directory path you use.

You'll need to have Node.js installed

Then, using NPM:

      cd ~/node
      npm install react react-dom babelify babel-preset-react react-bootstrap 
      npm install react-toastr react-select socket.io-client
      npm install jquery ewd-client ewd-react-tools qewd-react
      npm install -g browserify


      cd ~/node/tremor
      npm install babel-preset-es2015


### Creating a New Build


Each time you make a change to the source files, create a new build/bundle file as follows:

     cd ~/node/tremor
     browserify -t [ babelify --compact false --presets [es2015 react] ] app.js > bundle.js

Assuming there were no errors, the new bundle file (bundle.js) should be copied to your web server.



## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
