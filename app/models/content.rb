class Content < ApplicationRecord
  acts_as_list scope: :tier
  has_and_belongs_to_many :tiers
  has_and_belongs_to_many :inventories
end
