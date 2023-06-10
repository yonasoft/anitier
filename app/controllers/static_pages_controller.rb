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
  end

  def templates
  end

  def template_tier_list  # NEW METHOD
end

  def user
  end
end
