class CreateJoinTableContentsInventories < ActiveRecord::Migration[6.1]
  def change
    create_join_table :contents, :inventories do |t|
      t.index [:content_id, :inventory_id]
      # t.index [:inventory_id, :content_id]
    end
  end
end