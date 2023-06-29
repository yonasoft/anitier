# app/models/template_tier_list.rb
class TemplateTierList < ApplicationRecord
  belongs_to :user, optional: true

  enum source: { anilist: 0, mal: 1 }
  enum content_type: { anime: 0, manga: 1, character: 2 }

  after_create :create_default_tiers

  private

  def create_default_tiers
    %w(S A B C D).each do |rank|
      tiers.create!(rank: rank)
    end
  end
end
