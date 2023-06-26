class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :tier_list
end
