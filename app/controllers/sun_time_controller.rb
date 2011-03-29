require 'open-uri'

def find_or_raise(hash, key, message)
  raise message unless hash.has_key?(key)
  return hash[key]
end

class SunTimeController < ApplicationController
  def index
  end

  def fetch
    timeserver = 'http://icore11.servehttp.com/jewishTimeServices/ServletZmanimServices'

    begin
      # Get parameters
      lat     = find_or_raise(params, :lat, "Missing lattitude")
      long    = find_or_raise(params, :long, "Missing longitude")
      reqtime = Time.at(find_or_raise(params, :reqtime, "Missing request time").to_i / 1000)
      param   = params[:param].to_i

      # Prepare params for request
      params = "?makom=YISRAEL&latitude=#{lat}&longitude=#{long}&altitude=700&calculator=NAVAL&timezone=UTC&requestDate=#{reqtime.strftime('%d/%m/%Y')}&requestTime=#{reqtime.strftime('%H:%M:%S:000')}&requestTimestamp=#{param}&chita=LOUAH_AHID"

      data = ActiveSupport::JSON.decode(open(timeserver + params).read)

      nextstop = DateTime.strptime("#{data['nextStopDate']} #{data['nextStopTime']}", "%d/%m/%Y %H:%M:%S").to_i

      events_data = data['zmanim']['LOUAH_AHID'][0,4]

      events = events_data.map { |i| { 'ms' => DateTime.strptime(i["gt"], "%H:%M:%S").to_i, 'name' => i['id'], 'sun' => i["jt"] } }
      events.sort! { |a,b| a["ms"] <=> b["ms"] }

      render :json => { 
        :status => 'OK', 
        :coef    => data['coef'], 
        :stop    => nextstop, 
        :suntime => data['jewishTime'], 
        :events  => events,
        :param   => param, 
        :debug   => data,
        :request => params }

    rescue => e
      render :json => { :status => 'ERROR', :error => e.message, :trace => e.backtrace }
    end
  end
end
