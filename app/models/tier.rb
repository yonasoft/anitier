# app/models/tier.rb
class Tier < ApplicationRecord
  belongs_to :tier_list
  has_and_belongs_to_many :contents

  validates :rank, presence: true
  validates :tier_list_id, presence: true
end
