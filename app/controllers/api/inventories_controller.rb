module Api
  class InventoriesController < ApplicationController
    before_action :set_inventory, only: [:show, :update, :destroy]

    def index
      if params[:tier_list_id]
        @tier_list = TierList.find_by(id: params[:tier_list_id])
        @inventory = @tier_list ? @tier_list.inventory : nil
      else
        @inventories = Inventory.all
      end

      if @inventory
        render json: @inventory
      else
        render json: @inventories
      end
    end

    def show
      render json: @inventory
    end

    def create
      @inventory = Inventory.new(inventory_params)

      if @inventory.save
        render json: { inventory: @inventory }, status: :created  # Updated line
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end


    def update
      if @inventory.update(inventory_params)
        render json: @inventory
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @inventory.destroy
    end

    private
      def set_inventory
        @inventory = Inventory.find(params[:id])
      end

    def inventory_params
      params.require(:inventory).permit(:tier_list_id, contents: [])
    end
  end
end
