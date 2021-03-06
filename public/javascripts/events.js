function Event(time, name, $container) {
  var that = {
    time: null,
    name: null,
    $object: null,
    timer: null,

    _init: function(time, name, $container)
    {
      output("Adding event: " + name + " (" + time + ")");
      this.name = name;
      this.time = time * 1000;
      this.$object = $("<li />");

      if (!this.$object) alert("No Object found");

      $container.append(this.$object);
      this._update();
    },

    clear: function()
    {
      output("Remove event " + this.name);

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
      var diff = that.time - now;

      var calc_table = [
        { period: (1000*60*60), name: 'Hours'   },
        { period: (1000*60   ), name: 'Minutes' },
        { period: (1000      ), name: 'Seconds' }];

      that.timer = null;

      output("Check event " + that.name + " (" + now + " : " + that.time + ")");

      // In the past ?
      if (diff <= 0) {
        output("Event in the past, skipping: " + that.name);
        // that.clear();
        that.$object.html('Past ' + that.name).addClass('past');
        return;
      }

      for (var i=0;i<calc_table.length-1;i++) {
        var calc = calc_table[i];

        if (diff > calc.period) {
          setTimeout(update_now, ((diff % calc.period) + 500));
          that.$object.html(Math.round(diff/calc.period) + ' ' + calc.name + ' - ' + that.name);
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

      output('Loading events: ' + events.length);
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

