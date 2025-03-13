class Document < ApplicationRecord
  belongs_to :project
  belongs_to :user

  has_many :sharing_permissions

  validates :name, presence: true
end
