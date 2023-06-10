class CreateJoinTableContentsTiers < ActiveRecord::Migration[6.1]
  def change
    create_join_table :contents, :tiers do |t|
      t.index [:content_id, :tier_id]
      # t.index [:tier_id, :content_id]
    end
  end
end
