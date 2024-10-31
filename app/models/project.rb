class Project < ApplicationRecord
  belongs_to :user

  has_many :documents, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :shared_resources, as: :shareable, dependent: :destroy

  validates :name, presence: true
  validates :description, presence: true
end
