class Inventory < ApplicationRecord
  belongs_to :tier_list
  has_many :contents, as: :contentable, dependent: :destroy
end
