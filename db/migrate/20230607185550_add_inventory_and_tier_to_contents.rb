class AddInventoryAndTierToContents < ActiveRecord::Migration[6.1]
  def change
    add_reference :contents, :inventory, foreign_key: true
    add_reference :contents, :tier, foreign_key: true
  end
end
