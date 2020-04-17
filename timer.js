const fs = require('fs');
const SerialPort = require('serialport');
const {exec} = require('child_process');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('/dev/ttyUSB0');
const shell = require('shelljs')
const path = require('path');

var opn = require('opn');
const parser = port.pipe(new Readline({delimiter: '\n'}));

var delayedexit = false;
function makedecision() {
  console.log('well, continue');
  if (delayedexit) {
    console.log('waiting ...');
                                   // process.exit(22);
  }
}

function makeRecord() {
  function makeCurrentObj(data) {
    let currenObj;
    if (data.length === 0) currenObj = [];
    else {
      try {
        currenObj = JSON.parse(data);
      } catch (err) {
        console.log("can't read file");
      }
    }
    let currentDate = new Date();
    let tmpobj = {};
    tmpobj[currentDate] = 'POMO_DONE';
    currenObj.push(tmpobj);
    let stringvar = JSON.stringify(currenObj);

    fs.writeFile('./pomolog.json', stringvar, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      } else {
        console.log('file updated');
        console.log(`Pomo done ... ${currenObj.length}`);
      }
    });
  }

  fs.readFile('./pomolog.json', 'utf8', (err, jsondata) => {
    if (err) {
      console.log("File doesn't exist, making new one.");
      //  not a big deal;
      jsondata = [];
    }
    console.log('REaded sussesfully');
    makeCurrentObj(jsondata);
  });
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

let isPomo = false;

parser.on('data', function(line) {
  let second;
  let min;
  let tmp = line.match(/\d+/);
  let matchPhrase = line.match(/Second.to.count/);

    let matchWiki = /CMD_WikiNote/.test(line);

    if(matchWiki){
        console.log("red_button_short_Wiki_open_signal");
    shell.exec(path.join(__dirname, "wikinote.sh"));
    }

  if (!matchPhrase || !tmp) {
    delayhandler();
    return;
  }
  delayhandler(true);
  if (delayedexit) return;

  second = tmp[0];
  min = second / 60;
  if (min > 23 && !isPomo) {
    isPomo = true;
    exec("notify-send 'new pomo just started'");
  }

  if (min > 3) console.log(` ${Math.floor(min)} min`);
  else console.log(' < 3 min');
  if (second < 3 && second > 0 && isPomo) {
    isPomo = false;

    // opn('https://this-page-intentionally-left-blank.org/');
    //or / and
    exec("notify-send 'end of pomo'");
    makeRecord();
  } else if (!second) {
    console.log('waiting for meaningfull input ...');
  }
});
