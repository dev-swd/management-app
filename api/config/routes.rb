Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :test, only: %i[index]

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end

      resources :employees do
        collection do
          get :'show_by_devise'
        end
      end
      resources :departments
      resources :divisions do
        collection do
          get :'filterdepid'
        end
      end
      resources :projects
      resources :phases
      resources :risks
      resources :qualitygoals
      resources :members
      resources :audits do
        collection do
          get :'index_by_project'
        end
      end
      resources :changelogs do
        collection do
          get :'index_by_project'
        end
      end
      resources :reports
    end
  end
end
