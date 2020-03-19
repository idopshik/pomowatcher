

const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
const port = new SerialPort("/dev/ttyUSB0")

var opn = require('opn');
const parser = port.pipe(new Readline({ delimiter: '\n' }))
parser.on('data', function(line){

    let second
    let min;
    try {
        second = line.match(/\d+/)[0];
        min = second/60;
        
    } catch (err) {
        console.log("WRONG DEVICE");
    }
    if (min > 3) console.log(` ${Math.floor(min)} min`);
    else console.log(" < 3 min");
    if(second < 3){
        // opens the url in the default browser 
        opn('https://this-page-intentionally-left-blank.org/');
        return process.exit(22);
    };
})
