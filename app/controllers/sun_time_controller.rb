class SunTimeController < ApplicationController
  def fetch
    render :json => { :status => 'OK' }
  end
end
