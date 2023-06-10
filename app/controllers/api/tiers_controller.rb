module Api
  class TiersController < ApplicationController
    before_action :set_tier, only: [:show, :update, :destroy]

    def index
      @tiers = Tier.all
      render json: @tiers
    end

    def show
      render json: @tier
    end

    def create
      @tier = Tier.new(tier_params.except(:content_ids))

      if @tier.save
        @tier.contents = Content.where(id: tier_params[:content_ids])
        render json: @tier, status: :created
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    def update
      @tier = Tier.find(params[:id])

      if @tier.update(tier_params.except(:content_ids))
        @tier.contents = Content.where(id: tier_params[:content_ids])
        render json: @tier
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @tier.destroy
    end

    private

    def set_tier
      @tier = Tier.find(params[:id])
    end

    def tier_params   
      params.require(:tier).permit(:rank, :tier_list_id, content_ids: [])
    end
  end
end
