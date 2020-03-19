const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');

var opn = require('opn');
const parser = port.pipe(new Readline({delimiter: '\n'}));

var delayedexit = false;
function makedecision() {
  console.log('well, continue');
  if (delayedexit) {
    console.log("can't reach device. Check com port availibility");
    process.exit(22);
  }
}
function delayhandler(a) {
  if (a) {
    delayedexit = false;
    return;
  } else if (!delayedexit) {
    console.log('timer set. waiting for meaningfull input. ');
    delayedexit = true;
    setTimeout(makedecision, 500);
  }
}
parser.on('data', function(line) {
  let second;
  let min;
  let tmp = line.match(/\d+/);
  let matchPhrase = line.match(/Second.to.count/);
  if (!matchPhrase || !tmp) {
    delayhandler();
    return;
  }
  delayhandler(true);
  if (delayedexit) return;

  second = tmp[0];

  min = second / 60;

  if (min > 3) console.log(` ${Math.floor(min)} min`);
  else console.log(' < 3 min');
  if (second < 3 && second > 0) {
    // opens the url in the default browser
    opn('https://this-page-intentionally-left-blank.org/');
    return process.exit(22);
  } else if (!second) {
    console.log('waiting for meaningfull input ...');
  }
});
