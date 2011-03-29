Zait::Application.routes.draw do
  match 'sun_time' => 'sun_time#fetch'
  root :to => 'sun_time#index'
end
