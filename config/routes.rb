Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "static_pages#login"
  get "/login" => "static_pages#login"
  get "/home" => "static_pages#home"
  get "/create" => "static_pages#create"

end
