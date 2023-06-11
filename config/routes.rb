Rails.application.routes.draw do
  root 'static_pages#welcome'
  get '/login' => 'static_pages#login'
  get '/home' => 'static_pages#home'
  get '/create' => 'static_pages#create'
  get '/templates' => 'static_pages#templates'
  get '/tierlist/:id' => 'static_pages#tier_list'
  get '/templatetierlist/:id' => 'static_pages#template_tier_list'  # NEW LINE
  get '/user/:id' => 'static_pages#user'
  get '/user/me' => 'static_pages#user'

  namespace :api do
    resources :tier_lists do
      resource :inventory, only: [:show, :update]

      collection do
        get 'recent'
        get 'popular'
        get 'hot'
      end

      member do
        get 'user/:user_id', to: 'tier_lists#user_lists'
        get 'user/:user_id/posted', to: 'tier_lists#posted_user_lists'
        get 'user/:user_id/unposted', to: 'tier_lists#unposted_user_lists'
        get '/inventory', to: 'tier_lists#inventory' 
      end
    end

    resources :tiers

    match 'user/:user_id', to: 'tier_lists#user_lists', via: :get
    match 'user/:user_id/posted', to: 'tier_lists#posted_user_lists', via: :get
    match 'user/:user_id/unposted', to: 'tier_lists#unposted_user_lists', via: :get

    post '/inventories', to: 'inventories#create'
    get '/api/tier_lists/:tier_list_id/inventory', to: 'inventories#show_by_tier_list'

    resources :template_tier_lists
    resources :inventories, only: [:index]
    resources :contents

    get '/login', to: 'sessions#new'
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/authenticate', to: 'sessions#authenticate'
  end
end
