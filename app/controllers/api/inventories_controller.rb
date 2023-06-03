module Api
  class InventoriesController < ApplicationController
    before_action :set_inventory, only: [:show, :update, :destroy]

    # GET /inventories
    def index
      @inventories = Inventory.all
      render json: @inventories
    end

    # GET /inventories/1
    def show
      render json: @inventory
    end

    # POST /inventories
    def create
      @inventory = Inventory.new(inventory_params)

      if @inventory.save
        render json: @inventory, status: :created
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /inventories/1
    def update
      if @inventory.update(inventory_params)
        render json: @inventory
      else
        render json: @inventory.errors, status: :unprocessable_entity
      end
    end

    # DELETE /inventories/1
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
