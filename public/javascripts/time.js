function print(msg) {
  if (console && console.log)
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

function TimeObject(coef, sunTime, nextStop, timestamp) {
  return {
    coef: coef,
    sunTime: sunTime,
    nextStop: nextStop,
    timestamp: timestamp
  }
}

var Time = function() {
  return {
    flashClock: null,
    currTime: null,
    nextTime: null,

    flashReady: function(clock) 
    {
      print('Flash clock loaded');
      this.flashClock = clock;
      this._updateClock();
    },

    init: function()
    {
      print('Start clock init...');
      this._getTime();
    },

    _updateClock: function()
    {
      var that = Time;

      if (!that.flashClock || !that.currTime)
        return;

      print('Update flash clock');
      that.flashClock.loadClock(that.currTime.coef, that.currTime.sunTime, that.currTime.timestamp);
    },

    _getTime: function()
    {
      var that = Time;

      var params = {
        'lat': 31.78333,
        'long': 35.2,
        'reqtime': (new Date()).getTime(),
        'param': (new Date()).getTime()
      }

      function loadTime(data) {
        print('Got clock data: ' + data);
        print(data);
        var time = TimeObject();

        time.coef      = data.coef;
        time.sunTime   = stringToTime(data.suntime);
        time.nextStop  = data.stop;
        time.timestamp = data.param;

        that.currTime = time; 
        print('Jewish : ' + (new Date(time.sunTime)));
        print('Request: ' + (new Date(time.timestamp)));

        that._updateClock();
      }

      function loadTimeError(xhr, error) {
        print(' -- Error getting clock data: ' + error);
      }

      $.ajax({
        type: "GET",
        url: "sun_time",
        data: params,
        success: loadTime,
        error: loadTimeError,
        timeout: 5000
      });
    },
  }
}();
