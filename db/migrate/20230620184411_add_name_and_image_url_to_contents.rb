class AddNameAndImageUrlToContents < ActiveRecord::Migration[6.1]
  def change
    add_column :contents, :name, :string
    add_column :contents, :image_url, :string
  end
end
