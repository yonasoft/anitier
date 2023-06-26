class AddMalUrlToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :mal_url, :string
  end
end
