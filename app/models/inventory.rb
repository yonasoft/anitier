class Inventory < ApplicationRecord
  belongs_to :tier_list
  has_and_belongs_to_many :contents
  accepts_nested_attributes_for :contents
end
