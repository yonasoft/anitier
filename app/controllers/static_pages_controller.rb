class StaticPagesController < ApplicationController
  def welcome
    if logged_in?
      redirect_to "/home"
    else
      render "login"
    end
  end

  def login
  end

  def create
  end

  def home
    render 'activity'
  end

  def tier_list
    @tier_list_id = params[:id]
  end

  def templates
  end

  def user
  end
end
