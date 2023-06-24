module Api
  class ContentsController < ApplicationController
    before_action :set_content, only: [:show, :update, :destroy]

    def show
      render json: @content
    end

    def create
      @content = Content.find_or_initialize_by(api_id: content_params[:api_id])
      @content.assign_attributes(content_params.except(:inventory_ids, :tier_ids))

      if @content.save
        update_relationships
        render json: @content, status: :created
      else
        render json: @content.errors, status: :unprocessable_entity
      end
    end

    def update
      if @content.update(content_params.except(:inventory_ids, :tier_ids))
        update_relationships
        render json: @content
      else
        render json: @content.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @content.destroy
      head :no_content
    end

    private

    def set_content
      @content = Content.find(params[:id])
    end

    def update_relationships
      @content.inventories.clear
      @content.tiers.clear

      if content_params[:inventory_ids].present?
        inventories = Inventory.where(id: content_params[:inventory_ids])
        @content.inventories << inventories
      end

      if content_params[:tier_ids].present?
        tiers = Tier.where(id: content_params[:tier_ids])
        @content.tiers << tiers
      end
    end

    def content_params
      params.require(:content).permit(:api_id, :content_type, :source, :name, :image_url, inventory_ids: [], tier_ids: [])
    end
  end
end
