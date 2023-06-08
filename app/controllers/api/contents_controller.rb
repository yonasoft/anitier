module Api
  class ContentsController < ApplicationController
    before_action :set_content, only: [:show, :update, :destroy]

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

    private
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
      params.require(:content).permit(:api_id, :content_type, :source, inventory_ids: [], tier_ids: [])
    end
  end
end

module Api
  class InventoriesController < ApplicationController
    def create
      @inventory = Inventory.new(inventory_params.except(:content_ids))

      if @inventory.save
        @inventory.contents << Content.where(id: inventory_params[:content_ids])
        render json: @inventory, status: :created
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end

    def update
      if @inventory.update(inventory_params.except(:content_ids))
        @inventory.contents = Content.where(id: inventory_params[:content_ids])
        render json: @inventory
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end

    private
    def inventory_params
      params.require(:inventory).permit(:tier_list_id, content_ids: [])
    end
  end
end