module Api
  class InventoriesController < ApplicationController
    before_action :set_inventory, only: [:show, :update]

    def create
      @inventory = Inventory.new(inventory_params.except(:content_ids))

      if @inventory.save
        @inventory.contents << Content.where(id: inventory_params[:content_ids])
        render json: {inventory: @inventory, contents: inventory_params[:content_ids]}, status: :created
      else
        render json: {errors: @inventory.errors.full_messages}, status: :unprocessable_entity
      end
    end

    def show
      content_ids = @inventory.contents.pluck(:id)
      render json: {inventory: @inventory.attributes.merge(content_ids: content_ids)}
    end

    def update
      puts params
      begin
        if @inventory.update(inventory_params.except(:content_ids))
          @inventory.contents = Content.where(id: inventory_params[:content_ids])
          content_ids = @inventory.contents.pluck(:id)
          render json: {inventory: @inventory.attributes.merge(content_ids: content_ids)} # revised line
        else
          render json: {errors: @inventory.errors.full_messages}, status: :unprocessable_entity
        end
      rescue => e
        render json: {errors: ['Error while updating inventory: ' + e.message]}, status: :unprocessable_entity
      end
    end

    def show_by_id
      render json: {inventory: @inventory}
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
