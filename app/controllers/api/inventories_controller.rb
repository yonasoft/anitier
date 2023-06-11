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

    def show
      @inventory = Inventory.find_by!(tier_list_id: params[:tier_list_id])
      render json: {inventory: @inventory, contents: @inventory.contents}
    end

    def show_by_id
      @inventory = Inventory.find(params[:id])
      render json: @inventory
    end

    # In InventoriesController
    def show_by_tier_list
      @inventory = Inventory.find_by!(tier_list_id: params[:tier_list_id])
          render json: @inventory
    end

    def update
      @inventory = Inventory.find(params[:id])
      
      if @inventory.update(inventory_params.except(:content_ids))
        @inventory.contents.replace(Content.where(id: inventory_params[:content_ids]))
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
