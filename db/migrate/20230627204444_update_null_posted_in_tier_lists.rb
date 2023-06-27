class UpdateNullPostedInTierLists < ActiveRecord::Migration[6.1]
  def up
    TierList.where(posted: nil).update_all(posted: false)
  end
end
