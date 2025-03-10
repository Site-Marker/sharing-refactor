class Project < ApplicationRecord
  belongs_to :user

  has_many :documents, dependent: :destroy
  has_many :reports, dependent: :destroy
  has_many :sharing_permissions
  has_many :users, through: :sharing_permissions
  
  validates :name, presence: true
  validates :description, presence: true
end
