class ChangeContentsForPolymorphic < ActiveRecord::Migration[6.1]
  def change
    remove_reference :contents, :tier, index: true
    add_reference :contents, :contentable, polymorphic: true, index: true
  end
end
