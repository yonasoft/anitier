module Api
  class UsersController < ApplicationController
    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def new
      @user = User.new
    end

    def create
      @user = User.new(user_params)
      if @user.save
        log_in @user
        render json: { logged_in: true, user_id: @user.id }
      else
        render json: { logged_in: false, error: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def log_in(user)
      session[:user_id] = user.id
    end

    def user_params
      params.require(:user).permit(:username, :email, :password)
    end
  end
end
