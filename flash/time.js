function stringToTime(time) {
  var st = time.split(':');
  var datetime = new Date();
  datetime.setHours  (st[0]);
  datetime.setMinutes(st[1]);
  datetime.setSeconds(st[2]);
  return datetime.getTime();
}

function stringToDateTime(date, time) {
  var sd = date.split('/');
  var st = time.split(':');
  var datetime = new Date(sd[2], sd[1] - 1, sd[0], st[0], st[1], st[2], 0);
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
      console.log('Flash clock loaded');
      this.flashClock = clock;
      this._updateClock();
    },

    init: function()
    {
      console.log('Start clock init...');

      this._getTime();
    },

    _updateClock: function()
    {
      var that = Time;

      if (!that.flashClock || !that.currTime)
        return;

      console.log('Update flash clock');
      that.flashClock.loadClock(that.currTime.coef, that.currTime.sunTime, that.currTime.timestamp);
    },

    _getTime: function()
    {
      var that = Time;
      
      var params = {
        'makom': 'YISRAEL',
        'latitude': 31.78333,
        'longitude': 35.2,
        'altitude': 700,
        'calculator': 'NAVAL',
        'timezone': 'Asia/Jerusalem',
        'requestDate': '20/02/2011',
        'requestTime': '15:08:00:000',
        'requestTimestamp': (new Date()).getTime()
      };

      function loadTime(data) {
        console.log('Got clock data: ' + data);
        var time = TimeObject();

        time.coef      = data.coef;
        time.sunTime   = stringToTime(data.jewishTime);
        time.nextStop  = stringToDateTime(data.nextStopDate, data.nextStopTime);
        time.timestamp = parseInt(data.requestTimestamp);

        that.currTime = time; 
        console.log('Jewish : ' + (new Date(time.sunTime)));
        console.log('Request: ' + (new Date(time.timestamp)));

        that._updateClock();
      }

      function loadTimeError(xhr, error) {
        console.log(' -- Error getting clock data: ' + error);
      }

      var fake = {
        coef: 4.070101560564776,
        jewishDate: "16 ADAR_I 5771",
        jewishTime: "11:28:22",
        nextStopDate: "12/3/2011",
        nextStopTime: "17:29:41",
        processingTime: 0,
        requestTimestamp: (new Date()).getTime()
      }

      return loadTime(fake);

      $.ajax({
        type: "GET",
        url: "http://icore11.servehttp.com/jewishTimeServices/ServletZmanimServices",
        data: params,
        success: loadTime,
        error: loadTimeError,
        timeout: 5000
      });
    },
  }
}();
