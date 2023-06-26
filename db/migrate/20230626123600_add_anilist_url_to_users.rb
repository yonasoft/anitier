class AddAnilistUrlToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :anilist_url, :string
  end
end
