class StaticPagesController < ApplicationController
  def welcome
    redirect_to "/home"
  end

  def login
  end

  def create
  end

  def home
    render 'activity'
  end

  def tier_list

    @data = { tier_list_id: params[:id] }.to_json
    render 'tier_list'
  end

  def search_page
  end

  def user
    @data = { user_id: params[:id] }.to_json
    render 'user'
  end
end
