/*****************************************************************************
*    (c) 2005-2015 Copyright, Real-Time Innovations, All rights reserved.    *
*                                                                            *
* RTI grants Licensee a license to use, modify, compile, and create          *
* derivative works of the Software.  Licensee has the right to distribute    *
* object form only for use with RTI products. The Software is provided       *
* "as is", with no warranty of any type, including any warranty for fitness  *
* for any purpose. RTI is under no obligation to maintain or support the     *
* Software.  RTI shall not be liable for any incidental or consequential     *
* damages arising out of the use or inability to use the software.           *
*                                                                            *
******************************************************************************/

var sleep = require('sleep');
var rti   = require('rticonnextdds-connector');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var hasParam = process.argv[2];
if (typeof(hasParam) === "undefined") {
    hasParam = false;
} else {
    hasParam = true;
}

function Sensor(id) {
    this.id = ""+id;
    this.value =0;

    this.readvalue = function() {
        this.value = randomInt(0,100);
        var obj = {id: this.id, value: randomInt(0,100), timestamp: Math.floor(Date.now() / 1000)}
        return obj;
    }
}

var connector = new rti.Connector("MyParticipantLibrary::Sensor",__dirname + "/../Tutorial.xml");
if (hasParam) {
    output = connector.getOutput("TempPublisher::TempWriterSecondary");
    console.log("created secondary writer");
} else {
    output = connector.getOutput("TempPublisher::TempWriterPrimary");
    console.log("created primary writer");
}
var sensor = new Sensor(0);


for (;;) {
    var tmp = sensor.readvalue();
    console.log('about to set')
    output.instance.setFromJSON(tmp);
    console.log("Writing...");
    output.write();
    sleep.sleep(1);
}
