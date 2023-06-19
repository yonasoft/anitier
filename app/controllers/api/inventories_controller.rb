module Api
  class InventoriesController < ApplicationController
    before_action :set_inventory, only: [:show, :update]

    def create
      @inventory = Inventory.new(inventory_params.except(:content_ids))

      if @inventory.save
        @inventory.contents << Content.where(id: inventory_params[:content_ids])
        render json: @inventory, status: :created
      else
        render json: {errors: @inventory.errors.full_messages}, status: :unprocessable_entity
      end
    end

    def show
      contents = @inventory.contents.map(&:api_id) 
      render json: {inventory: @inventory.id, contents: contents}
    end

    def show_by_id
      render json: @inventory
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

    def set_inventory
      @inventory = Inventory.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: {errors: ['Inventory not found']}, status: :not_found
    end
  end
end
