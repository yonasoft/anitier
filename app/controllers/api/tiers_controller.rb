module Api
  class TiersController < ApplicationController
    before_action :set_tier, only: [:show, :update, :destroy]

    def index
      @tiers = Tier.where(tier_list_id: params[:tier_list_id])
      tiers_with_content_ids = @tiers.map do |tier| 
        content_ids = tier.contents.present? ? tier.contents.pluck(:id) : []
        puts "Content IDs for tier #{tier.id}: #{content_ids}"  # Debug output
        tier.attributes.merge(content_ids: content_ids)
      end
      render json: tiers_with_content_ids
    end

    def show
      content_ids = @tier.contents.present? ? @tier.contents.pluck(:id) : []
      render json: @tier.attributes.merge(content_ids: content_ids)
    end

    def update
      puts "Received params: #{params}"
      
      if @tier.update(tier_params.except(:content_ids))
        contents = Content.where(id: tier_params[:content_ids])
        puts "Found contents: #{contents}"
        @tier.contents = contents
        @tier.save  # Save the changes to the tier's contents
        @tier.reload  # Reload the tier object from the database
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
        render json: @tier.attributes.merge(content_ids: @tier.contents.pluck(:id)), status: :created
      else
        render json: @tier.errors, status: :unprocessable_entity
      end
    end

    def destroy
      @tier.destroy
    end

    private

    def set_tier
      @tier = Tier.find(params[:id])
      content_ids = @tier.contents.present? ? @tier.contents.pluck(:id) : []
      puts "Setting tier #{params[:id]} with content_ids: #{content_ids}"
    end


    def tier_params
      params.require(:tier).permit(:rank, :tier_list_id, content_ids: [])
    end
  end
end
