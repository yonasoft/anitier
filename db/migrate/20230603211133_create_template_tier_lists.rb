class CreateTemplateTierLists < ActiveRecord::Migration[6.1]
  def change
    create_table :template_tier_lists do |t|
      t.string :title
      t.text :description
      t.integer :source
      t.integer :content_type
      t.references :user, null: false, foreign_key: true
      t.integer :upvotes
      t.integer :downvotes

      t.timestamps
    end
  end
end
