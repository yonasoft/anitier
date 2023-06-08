Rails.application.routes.draw do

  root "static_pages#welcome"
  get "/login" => "static_pages#login"
  get "/home" => "static_pages#home"
  get "/create" => "static_pages#create"
  get "/templates" => "static_pages#templates"
  get "/tierlist/:id" => "static_pages#tier_list"
  get "/templatetierlist/:id" => "static_pages#template_tier_list"  # NEW LINE
  get "/user/:id" => "static_pages#user"
  get "/user/me" => "static_pages#user"

  namespace :api do
    resources :users
    resources :tier_lists do
      get 'recent', on: :collection
      get 'popular', on: :collection
      get 'hot', on: :collection
      resources :tiers
      resources :inventories
      get 'user/:user_id', to: 'tier_lists#user_lists', on: :collection
    end
    resources :template_tier_lists
    resources :tiers
    resources :inventories, only: [:index]
    resources :contents
    
    get "/login", to: "sessions#new"
    post "/login", to: "sessions#create"
    delete "/logout", to: "sessions#destroy"
    get "/authenticate", to: "sessions#authenticate"
    get 'user/:user_id/posted', to: 'tier_lists#posted_user_lists', on: :collection
    get 'user/:user_id/unposted', to: 'tier_lists#unposted_user_lists', on: :collection
  end
end

