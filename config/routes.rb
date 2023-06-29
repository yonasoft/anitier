Rails.application.routes.draw do
  root 'static_pages#welcome'
  get '/login' => 'static_pages#login'
  get '/home' => 'static_pages#home'
  get '/create' => 'static_pages#create'
  get '/search' => 'static_pages#search_page'
  get '/tierlist/:id' => 'static_pages#tier_list'
  get '/templatetierlist/:id' => 'static_pages#template_tier_list'
  get '/user/:id' => 'static_pages#user'
  get '/profile' => 'static_pages#profile'

  namespace :api do
    get '/login', to: 'sessions#new'
    post '/login', to: 'sessions#create'
    delete '/logout', to: 'sessions#destroy'
    get '/authenticate', to: 'sessions#authenticate'
    get '/search_mal_content', to: 'mal_api#search_mal_content'
    get '/fetch_mal_content', to: 'mal_api#fetch_mal_content'
    get '/fetch_user_anime_list', to: 'mal_api#fetch_user_anime_list'
    get '/fetch_user_manga_list', to: 'mal_api#fetch_user_manga_list'
    get 'tier_lists/filtered_user_lists', to: 'tier_lists#filtered_user_lists'

    resources :users, only: [:show, :create] do
      member do
        get 'tier_lists', to: 'tier_lists#user_lists'
        get 'posted_tier_lists', to: 'tier_lists#posted_user_lists'
        get 'unposted_tier_lists', to: 'tier_lists#unposted_user_lists'
        put '', to: 'users#update'
      end
    end

    resources :tiers
    resources :inventories, only: [:show, :update]
    resources :template_tier_lists
    resources :contents, only: [:show, :create, :destroy]

    resources :tier_lists do
      get 'user_vote_status', on: :member
      member do
        get 'tiers'
        post 'upvote'
        post 'downvote'
      end  
      collection do
        get :search
        get 'recent'
        get 'top'
        get 'filtered_user_lists'
      end
    end
  end
end
