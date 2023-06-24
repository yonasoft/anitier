class CreateContents < ActiveRecord::Migration[6.1]
  def change
    create_table :contents do |t|
      t.integer :api_id
      t.references :tier, null: false, foreign_key: true

      t.timestamps
    end
  end
end
