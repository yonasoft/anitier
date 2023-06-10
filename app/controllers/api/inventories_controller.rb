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
      if @tier.update(tier_params.except(:content_ids))
        @tier.contents.replace(Content.where(id: tier_params[:content_ids]))
        render json: @tier
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    private

    def inventory_params
      params.require(:inventory).permit(:tier_list_id, content_ids: [])
    end
  end
end
