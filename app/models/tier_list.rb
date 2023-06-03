# app/models/tier_list.rb
class TierList < ApplicationRecord
  belongs_to :user, optional: true
  has_one :inventory, dependent: :destroy
  has_many :tiers, dependent: :destroy
  
  enum source: { anilist: 0, mal: 1 }
  enum content_type: { anime: 0, manga: 1, character: 2 }

  after_create :create_default_tiers

  private

  def create_default_tiers
    %w[S A B C D].each do |rank|
      self.tiers.create!(rank: rank)
    end
  end
end
