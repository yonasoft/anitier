# app/models/content.rb
class Content < ApplicationRecord
  acts_as_list scope: :tier
  belongs_to :contentable, polymorphic: true
end
