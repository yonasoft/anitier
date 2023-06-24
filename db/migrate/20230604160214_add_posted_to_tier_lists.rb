class AddPostedToTierLists < ActiveRecord::Migration[6.1]
  def change
    add_column :tier_lists, :posted, :boolean
  end
end
