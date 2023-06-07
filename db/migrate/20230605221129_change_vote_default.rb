class ChangeVoteDefault < ActiveRecord::Migration[6.1]
  def change
    change_column_default :tier_lists, :upvotes, 0
    change_column_default :tier_lists, :downvotes, 0
  end
end
