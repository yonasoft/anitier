Rails.application.routes.draw do

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root "static_pages#welcome"
  get "/login" => "static_pages#login"
  get "/home" => "static_pages#home"
  get "/create" => "static_pages#create"
  get "/templates" => "static_pages#templates"
  get "/tierlist/:id" => "static_pages#tier_list"
  get "/user/:id" => "static_pages#user"
  get "/user/me" => "static_pages#user"

  namespace :api do
    resources :users
    
    get "/login", to: "sessions#new"
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy"
    get "/authenticate", to: "sessions#authenticate"
  end

end
