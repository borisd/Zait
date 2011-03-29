Location = function() {
  return {
    text: null,
    lng: null,
    lat: null,

    init: function() 
    {
      this.geocoder = new google.maps.Geocoder();

      if ($.cookie("location_text")) {
        this.lat  = $.cookie("location_lat");
        this.lng  = $.cookie("location_lng");
        this.text = $.cookie("location_text");

        if (this.lat && this.lng && this.text)
          this._updateClock(this.lat, this.lng, this.text);
      }
    },

    _updateClock: function() 
    {
      $('#resolved_address').text(this.text);
      Time.setLocation(this.lat, this.lng);
    },

    decode: function(string)
    {
      function validAddress(result) {
        var that = Location;

        that.text = result.formatted_address;
        that.lat  = result.geometry.location.lat();
        that.lng  = result.geometry.location.lng();

        // Save so user doesn't have to re-enter in the future
        $.cookie("location_lat",  that.lat,  { expires: 7 });
        $.cookie("location_lng",  that.lng,  { expires: 7 });
        $.cookie("location_text", that.text, { expires: 7 });

        that._updateClock(that.lat, that.lng, that.text);
      }

      $('#resolved_address').text('');

      this.geocoder.geocode( { 'address': string }, 
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            validAddress(results[0]);
          } else {
            alert("Could not find location");
          }
        });
    }
  }
}();
