class RemoveUpvotesDownvotesFromTierLists < ActiveRecord::Migration[6.1]
  def change
    remove_column :tier_lists, :upvotes
    remove_column :tier_lists, :downvotes
  end
end
