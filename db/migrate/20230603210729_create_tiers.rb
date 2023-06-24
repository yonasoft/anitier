class CreateTiers < ActiveRecord::Migration[6.1]
  def change
    create_table :tiers do |t|
      t.string :rank
      t.references :tier_list, null: false, foreign_key: true

      t.timestamps
    end
  end
end
