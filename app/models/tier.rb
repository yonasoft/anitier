# app/models/tier.rb
class Tier < ApplicationRecord
  belongs_to :tier_list
  has_many :contents, dependent: :destroy

  validates :rank, presence: true
end
