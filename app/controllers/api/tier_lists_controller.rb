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
      if @tier_list.destroy
        render json: { message: 'Tier list deleted successfully' }, status: :ok
      else
        render json: { error: 'Failed to delete tier list' }, status: :unprocessable_entity
      end
    end

    def recent
      @tier_lists = TierList.posted.recent
      render json: @tier_lists
    end

    def top
      @tier_lists = TierList.posted.top
      render json: @tier_lists
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

    private

    def set_tier_list
      @tier_list = TierList.find(params[:id])
    end

    def tier_list_params
      params.require(:tier_list).permit(:title, :description, :source, :content_type, :user_id, :posted)
    end
  end
end
