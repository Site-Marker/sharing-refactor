class Report < ApplicationRecord
  belongs_to :project
  belongs_to :user

  has_many :sharing_permissions

  validates :title, presence: true
end
