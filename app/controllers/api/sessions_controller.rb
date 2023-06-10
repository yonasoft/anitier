module Api
  class SessionsController < ApplicationController
    def new
    end

    def create
      user = User.find_by("email = :value OR username = :value", value: params[:session][:username].downcase)
      if user && user.authenticate(params[:session][:password])
        reset_session
        log_in user
        render json: { logged_in: true, user_id: user.id }
      else
        render json: { logged_in: false, error: 'Invalid email/username and password combination' }, status: :unprocessable_entity
      end
    end

    def destroy
      if logged_in?
        log_out
        render json: { logged_in: false }
      end
    end

    def log_out
      session.delete(:user_id)
      @current_user = nil
    end

    def authenticate
      if logged_in?
        render json: { logged_in: true, user_id: current_user.id, username: current_user.username }
      else
        render json: { logged_in: false, message: "User is not logged in." }, status: :unauthorized
        end
    rescue => e
      render json: { logged_in: false, message: "Error: #{e.message}" }, status: :unauthorized
    end
  end
end
