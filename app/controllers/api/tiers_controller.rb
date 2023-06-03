module Api
  class TiersController < ApplicationController
    before_action :set_tier, only: [:show, :update, :destroy]

    # GET /tiers
    def index
      @tiers = Tier.all
      render json: @tiers
    end

    # GET /tiers/1
    def show
      render json: @tier
    end

    # POST /tiers
    def create
      @tier = Tier.new(tier_params)

      if @tier.save
        render json: @tier, status: :created
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /tiers/1
    def update
      if @tier.update(tier_params)
        render json: @tier
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    # DELETE /tiers/1
    def destroy
      @tier.destroy
    end

    private
      def set_tier
        @tier = Tier.find(params[:id])
      end

      def tier_params
        params.require(:tier).permit(:rank, :tier_list_id)
      end
  end
end
