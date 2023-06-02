module Api
  class UsersController < ApplicationController
    def show
      @user = User.find(params[:id])
    end

    def new
      @user = User.new
    end

   def create
     @user = User.new(user_params)

      if @user.save
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    end

    private

    def user_params
      params.require(:user).permit(:name, :email, :password)
    end
  end
end