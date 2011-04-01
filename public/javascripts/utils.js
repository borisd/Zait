function output(msg) {
  if (typeof console === 'undefined')
    return;

  console.log(msg);
}

function stringToTime(time) {
  var st = time.split(':');
  var datetime = new Date();
  datetime.setHours  (st[0]);
  datetime.setMinutes(st[1]);
  datetime.setSeconds(st[2]);
  return datetime.getTime();
}

