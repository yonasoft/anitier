module Api
  class TierListsController < ApplicationController
     before_action :set_tier_list, only: [:show, :update, :destroy, :tiers]
     protect_from_forgery with: :null_session
    
    def index
      @tier_lists = TierList.all
      render json: @tier_lists
    end

    def show
      render json: @tier_list.as_json(include: { tiers: { }, inventory: { }, user: {} }, methods: [:upvotes, :downvotes])
    end

    def update
      if @tier_list.update(tier_list_params)
        render json: @tier_list.as_json(include: { tiers: { }, inventory: { } })
      else
        render json: { errors: @tier_list.errors }, status: :unprocessable_entity
      end
    end

    def inventory
      render json: @tier_list.inventory
    end

    def create
      tier_list = TierList.new(tier_list_params)

      if tier_list.save
        render json: { tier_list: tier_list, inventory: tier_list.inventory }, status: :created
      else
        Rails.logger.error("TierList validation failed: #{tier_list.errors.full_messages}")
        render json: { error: tier_list.errors }, status: :unprocessable_entity
      end
    end

    def destroy
      ActiveRecord::Base.transaction do
        @tier_list.votes.each do |vote|
          Rails.logger.info("Deleting vote: #{vote.id}")
          vote.destroy!
        end
        @tier_list.tiers.each do |tier|
          Rails.logger.info("Deleting tier: #{tier.id}")
          tier.destroy!
        end
        Rails.logger.info("Deleting inventory: #{@tier_list.inventory.id}")
        @tier_list.inventory.destroy!
        Rails.logger.info("Deleting tier_list: #{@tier_list.id}")
        @tier_list.destroy!
      end
      render json: { message: 'Tier list deleted successfully' }, status: :ok
    rescue => e
      render json: { error: 'Failed to delete tier list', detail: e.message }, status: :unprocessable_entity
    end

    def recent
      @tier_lists = TierList.posted.recent
      render json: @tier_lists
    end

    def top
      tier_lists = TierList.where(posted: true).includes(:votes)
      tier_lists = tier_lists.to_a
      tier_lists.sort! { |a, b| (b.upvotes - b.downvotes) <=> (a.upvotes - a.downvotes) }
      render json: tier_lists
    end

    def user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists
      render json: @tier_lists
    end

    def posted_user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists.posted
      render json: @tier_lists
    end

    def unposted_user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists.unposted
      render json: @tier_lists
    end

    def tiers
      tiers_with_content_ids = @tier_list.tiers.map do |tier| 
        content_ids = tier.contents.present? ? tier.contents.pluck(:id) : []
        tier.attributes.merge(content_ids: content_ids)
      end
      render json: tiers_with_content_ids
    end

    def upvote
      tier_list = TierList.find(params[:id])
      vote = tier_list.votes.find_or_initialize_by(user_id: params[:user_id])
      vote.upvoted = true
      vote.downvoted = false
      if vote.save
        render json: { status: 'success', upvotes: tier_list.upvotes, downvotes: tier_list.downvotes }
      else
        render json: { status: 'error', message: 'Could not save vote' }, status: :unprocessable_entity
      end
    end

    def downvote
      tier_list = TierList.find(params[:id])
      vote = tier_list.votes.find_or_initialize_by(user_id: params[:user_id])
      vote.upvoted = false
      vote.downvoted = true
      if vote.save
        render json: { status: 'success', upvotes: tier_list.upvotes, downvotes: tier_list.downvotes }
      else
        render json: { status: 'error', message: 'Could not save vote' }, status: :unprocessable_entity
      end
    end

    def user_vote_status
      tier_list = TierList.find(params[:id])
      user = User.find(params[:user_id])
      vote = tier_list.votes.find_by(user_id: user.id)
      status = if vote
                { upvoted: vote.upvoted, downvoted: vote.downvoted }
              else
                { upvoted: false, downvoted: false }
              end
      render json: { user_vote_status: status }
    end

    def filtered_user_lists
      @user = User.find(params[:user_id])
      @tier_lists = @user.tier_lists.where(content_type: params[:content_type])

      case params[:posted_status]
      when 'all'
        # Do nothing, we want all lists
      when 'posted'
        @tier_lists = @tier_lists.posted
      when 'unposted'
        @tier_lists = @tier_lists.unposted
      end

      render json: @tier_lists
    end

    def search
      query = params[:query]
      type = params[:type].to_i
      if type == -1 # Search across all types
        @tier_lists = []
        3.times do |i|
          @tier_lists.concat(TierList.where(content_type: i).search_full_text(query))
        end
      else # Search for specific type
        @tier_lists = TierList.where(content_type: type).search_full_text(query)
      end
      @tier_lists = @tier_lists.to_a.sort_by(&:created_at).reverse
          
      render json: @tier_lists
    end

    private

    def set_tier_list
      @tier_list = TierList.find(params[:id])
    end

    def tier_list_params
      params.require(:tier_list).permit(:title, :description, :source, :content_type, :user_id, :posted)
    end
  end
end
