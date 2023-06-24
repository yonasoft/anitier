module Api
  class TemplateTierListsController < ApplicationController
    before_action :set_template_tier_list, only: [:show, :update, :destroy]

    def index
      @template_tier_lists = TemplateTierList.all
      render json: @template_tier_lists
    end

    def show
      render json: @template_tier_list
    end

    def create
      @template_tier_list = TemplateTierList.new(template_tier_list_params)

      if @template_tier_list.save
        render json: @template_tier_list, status: :created
      else
        render json: @template_tier_list.errors, status: :unprocessable_entity
      end
    end

    def update
      if @template_tier_list.update(template_tier_list_params)
        render json: @template_tier_list
      else
        render json: @template_tier_list.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @template_tier_list.destroy
    end

    private

    def set_template_tier_list
      @template_tier_list = TemplateTierList.find(params[:id])
    end

    def template_tier_list_params
      params.require(:template_tier_list).permit(:title, :description, :source, :content_type, :user_id)
    end
  end
end
