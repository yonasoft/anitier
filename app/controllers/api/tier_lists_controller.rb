module Api
  class TierListsController < ApplicationController
    before_action :set_tier_list, only: [:show, :update, :destroy]

    # GET /tier_lists
    def index
      @tier_lists = TierList.all
      render json: @tier_lists
    end

    # GET /tier_lists/1
    def show
      render json: @tier_list
    end

    # POST /tier_lists
    def create
      @tier_list = TierList.new(tier_list_params)

      if @tier_list.save
        render json: @tier_list, status: :created
      else
        render json: @tier_list.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /tier_lists/1
    def update
      if @tier_list.update(tier_list_params)
        render json: @tier_list
      else
        render json: @tier_list.errors, status: :unprocessable_entity
      end
    end

    # DELETE /tier_lists/1
    def destroy
      @tier_list.destroy
    end

    private
      def set_tier_list
        @tier_list = TierList.find(params[:id])
      end

      def tier_list_params
        params.require(:tier_list).permit(:title, :description, :source, :content_type, :user_id)
      end
  end
end
