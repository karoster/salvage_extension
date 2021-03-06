Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :motorcycles, only: [:index]
      resources :parts, only: [:index, :create]
    end
  end
  # root 'homepage#index'
  root 'welcome#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
