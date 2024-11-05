class Project < ApplicationRecord
  belongs_to :user

  has_many :documents, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :shared_resources, as: :shareable, dependent: :destroy

  validates :name, presence: true
  validates :description, presence: true

  scope :created_by, ->(user) { where(user_id: user.id) }
 
  scope :shared_with, ->(user) {
    where(id: SharedResource.where(
      shareable_type: 'Project',
      user_id: user.id
    ).select(:shareable_id))
  }

  scope :accessible_by, ->(user) {
    created_by(user).or(shared_with(user))
  }
end
