module Api
  class TiersController < ApplicationController
    before_action :set_tier, only: [:show, :update, :destroy]

    def index
      @tiers = Tier.all
      render json: @tiers
    end

    def show
      content_ids = @tier.contents.pluck(:id)
      render json: @tier.attributes.merge(content_ids: content_ids)
    end

    def update
      if @tier.update(tier_params.except(:content_ids))
        @tier.contents = Content.where(id: tier_params[:content_ids])
        content_ids = @tier.contents.pluck(:id)
        render json: { tier: @tier.attributes.merge(content_ids: content_ids) }
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
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

    def destroy
      @tier.destroy
    end

    def content_ids
      contents.pluck(:id)
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
