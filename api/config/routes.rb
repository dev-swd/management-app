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
        member do
          get :'show_by_devise'
          get :'index_by_approval'
          get :'index_by_div'
        end
      end
      resources :departments
      resources :divisions do
        member do
          get :index_by_dep
          get :index_by_approval
        end
        collection do
          get :index_with_authcnt
        end
      end
      resources :projects do
        member do
          get :'index_by_member_running'
        end
        collection do
          get :'index_by_member'
          get :'index_by_conditional'
        end
      end
      resources :phases do
        member do
          get :'index_by_project'          
        end
      end
      resources :risks
      resources :qualitygoals
      resources :members
      resources :audits do
        collection do
          get :'index_by_project'
        end
      end
      resources :changelogs do
        member do
          get :'index_by_project'
        end
      end
      resources :reports
      resources :tasks do
        member do
          get :'index_by_phase'
          get :'index_by_project'
          patch :'update_for_planned'
          patch :'update_for_actualdate'
        end
      end

      resources :dailyreports do
        member do
          patch :'status_update'
        end
        collection do
          get :'index_by_emp'
          patch :'approval_update'
          patch :'approval_cancel'
        end
      end
      resources :workreports do
        member do
          get :'index_by_daily'
        end
      end

      resources :applovalauths

      resources :progressreports do
        member do
          get :'index_by_project'
          patch :'create_report'
        end
      end

      resources :evms do
        collection do
          get :'index_by_conditional'
        end
      end

    end
  end
end
