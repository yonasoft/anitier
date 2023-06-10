class TierList < ApplicationRecord
  after_create :create_inventory

  belongs_to :user, optional: true
  has_one :inventory, dependent: :destroy
  has_many :tiers, dependent: :destroy

  enum source: { anilist: 0, mal: 1 }
  enum content_type: { anime: 0, manga: 1, character: 2 }

  validates :upvotes, numericality: { greater_than_or_equal_to: 0 }
  validates :downvotes, numericality: { greater_than_or_equal_to: 0 }
  validates :source, presence: true
  validates :content_type, presence: true

  scope :posted, -> { where(posted: true) }
  scope :unposted, -> { where(posted: false) }
  scope :recent, -> { order(created_at: :desc) }
  scope :popular, -> { order('(upvotes - downvotes) DESC') }
  scope :hot, -> { where('created_at >= ?', 1.week.ago).order('(upvotes - downvotes) DESC') }

  def create_inventory
    create_inventory!
  end
end
