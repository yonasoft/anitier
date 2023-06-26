module Api
  class TierListsController < ApplicationController
     before_action :set_tier_list, only: [:show, :update, :destroy, :tiers]
    
    def index
      @tier_lists = TierList.all
      render json: @tier_lists
    end

    def show
      render json: @tier_list.as_json(include: { tiers: { }, inventory: { }, user: {} })
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

      if tier_list.save!
        render json: { tier_list: tier_list, inventory: tier_list.inventory }, status: :created
      else
        Rails.logger.error("TierList validation failed: #{tier_list.errors.full_messages}")
        render json: { error: tier_list.errors }, status: :unprocessable_entity
      end
    end

    def destroy
      @tier_list.destroy
    end

    def recent
      @tier_lists = TierList.posted.recent
      render json: @tier_lists
    end

    def popular
      @tier_lists = TierList.posted.popular
      render json: @tier_lists
    end

    def hot
      @tier_lists = TierList.posted.hot
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
      vote = tier_list.votes.find_or_initialize_by(user_id: current_user.id)
      vote.upvoted = true
      vote.downvoted = false
      vote.save
      render json: { status: 'success' }
    end

    def downvote
      tier_list = TierList.find(params[:id])
      vote = tier_list.votes.find_or_initialize_by(user_id: current_user.id)
      vote.upvoted = false
      vote.downvoted = true
      vote.save
      render json: { status: 'success' }
    end

    def user_vote_status(user)
      vote = votes.find_by(user_id: user.id)
      return { upvoted: vote.upvoted, downvoted: vote.downvoted } if vote
      { upvoted: false, downvoted: false }
    end

    private

    def set_tier_list
      @tier_list = TierList.find(params[:id])
    end

    def tier_list_params
      params.require(:tier_list).permit(:title, :description, :source, :content_type, :user_id, :upvotes, :downvotes, :posted)
    end
  end
end
