class ChangeDefaultsInTierLists < ActiveRecord::Migration[6.1]
  def change
    change_column_default :tier_lists, :title, ""
    change_column_default :tier_lists, :description, ""
    change_column_default :tier_lists, :source, 0
    change_column_default :tier_lists, :content_type, 0
  end
end
