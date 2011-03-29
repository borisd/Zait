function Event(time, name, $container) {
  var that = {
    time: null,
    name: null,
    $object: null,
    timer: null,

    _init: function(time, name, $container)
    {
      print("Adding event: " + name + " (" + time + ")");
      this.name = name;
      this.time = time * 1000;
      this.$object = $("<li />");
      $container.append(this.$object);
      this._update();
    },

    clear: function()
    {
      print("Remove event " + this.name);

      if (this.$object) {
        this.$object.remove();
        this.$object = null;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },

    _update: function() 
    {
      var that = this;

      function update_now() {
        that._update();
      }

      var now = (new Date()).getTime();
      var diff = this.time - now;

      var calc_table = [
        { period: (1000*60*60), name: 'Hours'   },
        { period: (1000*60   ), name: 'Minutes' },
        { period: (1000      ), name: 'Seconds' }];

      this.timer = null;

      print("Check event " + this.name + " (" + now + " : " + this.time + ")");

      // In the past ?
      if (diff <= 0) {
        print("Event in the past, skipping: " + this.name);
        this.clear();
        return;
      }

      for (var i=0;i<calc_table.length-1;i++) {
        var calc = calc_table[i];

        if (diff > calc.period) {
          setTimeout(update_now, ((diff % calc.period) + 500));
          this.$object.html(Math.round(diff/calc.period) + ' ' + calc.name + ' - ' + this.name);
          return;
        }
      }
    },
  }
  that._init(time, name, $container);
  return that;
}

Events = function() {
  return {
    events: [],
    $container: null,

    init: function() 
    {
      this.$container = $('#event_list ul');
    },

    load: function(events)
    {
      this._clear();

      print('\n\nLOADING EVENTS: ' + events.length + '\n\n');
      for (var i=0; i < events.length - 1; i++) {
        var obj = events[i];
        this.events.push(new Event(obj.ms, obj.name, this.$container));
      }
    },

    _clear: function()
    {
      this.$container.html('');

      for (var i=0;i<this.events.length-1;i++) {
        this.events[i].clear();
      }
    }
  }
}();

