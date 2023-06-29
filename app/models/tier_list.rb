class TierList < ApplicationRecord
  include PgSearch::Model
  
  pg_search_scope :search_full_text,
                  against: [:title, :description],
                  associated_against: {
                    user: :username
                  },
                  using: {
                    tsearch: {prefix: true} 
                  }
                  
  after_create :create_inventory

  belongs_to :user, optional: true
  has_one :inventory, dependent: :destroy
  has_many :tiers, dependent: :destroy
  has_many :votes

  enum source: { anilist: 0, mal: 1 }
  enum content_type: { anime: 0, manga: 1, character: 2 }

  validates :upvotes, numericality: { greater_than_or_equal_to: 0 }
  validates :downvotes, numericality: { greater_than_or_equal_to: 0 }
  validates :source, presence: true
  validates :content_type, presence: true

  scope :posted, -> { where(posted: true) }
  scope :unposted, -> { where(posted: false) }
  scope :recent, -> { order(created_at: :desc) }
  scope :top, -> { order(Arel.sql('(upvotes - downvotes) DESC')) }
  scope :hot, -> { where('created_at >= ?', 1.week.ago).order('(upvotes - downvotes) DESC') }

  def create_inventory
    Inventory.create!(tier_list: self)
  end

    has_many :votes

  def upvotes
    self.votes.where(upvoted: true).count
  end

  def downvotes
    self.votes.where(downvoted: true).count
  end

  
end
