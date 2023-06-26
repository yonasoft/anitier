class CreateVotes < ActiveRecord::Migration[6.1]
  def change
    create_table :votes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :tier_list, null: false, foreign_key: true
      t.boolean :upvoted
      t.boolean :downvoted

      t.timestamps
    end
  end
end
