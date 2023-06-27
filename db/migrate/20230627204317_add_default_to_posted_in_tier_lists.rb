class AddDefaultToPostedInTierLists < ActiveRecord::Migration[6.1]
  def change
    change_column_default :tier_lists, :posted, from: nil, to: false
  end
end
