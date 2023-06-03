class User < ApplicationRecord

    has_many :tier_lists

    before_save { self.email = email.downcase if email.present? }
    before_save { self.username = username.downcase if username.present? }

    validates :username, presence:true, length: {minimum:3, maximum:25}, uniqueness: { case_sensitive: false }
    VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
    validates :email, presence:true, length: {minimum:5, maximum:255},
        format: { with: VALID_EMAIL_REGEX },
        uniqueness: { case_sensitive: false }
    has_secure_password
    validates :password, presence: true, length: {minimum: 6 }
end
