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
    timestamp: timestamp,

    print: function() 
    {
      print('Coef: ' + this.coef);
      print('Jewish : ' + (new Date(this.sunTime)));
      print('Request: ' + (new Date(this.timestamp)));
    }
  }
}

var Time = function() {
  return {
    flashClock: null,
    currTime: null,
    nextTime: null,
    timer: null,

    flashReady: function(clock) 
    {
      print('Flash clock loaded');
      this.flashClock = clock;
      this._updateClock();
    },

    init: function()
    {
      print('Start clock init...');
      this._getTime((new Date()).getTime(), this._setTime);
    },

    _setTime: function(time)
    {
      var that = Time;
      var now = (new Date()).getTime();

      print('Setting CURR time... next: ' + (new Date(time.nextStop)));
      time.print();

      that.currTime = time; 

      if (!that.nextTime)
        that._getTime(that.currTime.nextStop, that._setNextTime);

      if (that.timer)
        clearTimeout(that.timer);

      print('Now : ' + now);
      print('Stop: ' + that.currTime.nextStop + ' - ' + (new Date(that.currTime.nextStop)));
      console.log('Starting timer in ' + (that.currTime.nextStop - now) + ' ms');
      that.timer = setTimeout(that._updateClock, that.currTime.nextStop - now); 

      that._updateClock();
    },

    _setNextTime: function(time)
    {
      var that = Time;

      print('Setting NEXT time...');
      time.print();

      that.nextTime = time;
      that._updateClock();
    },

    _updateClock: function()
    {
      var that = Time;
      var now = (new Date()).getTime();

      print('Running update clock..');

      if (!that.flashClock || !that.currTime)
        return;

      if (that.currTime.nextStop <= now) {
        if (!that.nextTime) {
          print('-- Need the next time object, but its not present yet');
          return;
        }

        print('Advance to next time object');

        var nextTime = that.nextTime;
        that.nextTime = null;

        that._setTime(nextTime);
      } else {
        print('Update flash clock');
        that.flashClock.loadClock(that.currTime.coef, that.currTime.sunTime, that.currTime.timestamp);
      }
    },

    _getTime: function(start, callback)
    {
      var that = Time;

      var params = {
        'lat': 31.78333,
        'long': 35.2,
        'reqtime': start,
        'param': (new Date()).getTime()
      }

      function loadTime(data) {
        print('Got clock data: ' + data);
        print(data);
        var time = TimeObject();

        time.coef      = data.coef;
        time.sunTime   = stringToTime(data.suntime);
        time.nextStop  = data.stop * 1000;
        time.timestamp = data.param;

        callback(time);
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
        timeout: 15000
      });
    },
  }
}();
