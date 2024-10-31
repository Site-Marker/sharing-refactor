Rails.application.routes.draw do
  get 'shared_resources/create'

  resources :documents
  resources :reports

  resources :projects do
    resources :documents
    resources :reports
  end

  resources :users, only: [:index]
  resources :shared_resources, only: [:show, :create]

  put 'shared_resources/:resource_type/:resource_id/:user_id', to: 'shared_resources#update_permission'

  devise_for :users
  root 'home#index'
  get 'me' => 'users#current'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  match '*path', to: 'home#index', via: :all
end
