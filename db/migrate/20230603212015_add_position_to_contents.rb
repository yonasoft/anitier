class AddPositionToContents < ActiveRecord::Migration[6.1]
  def change
    add_column :contents, :position, :integer
  end
end
