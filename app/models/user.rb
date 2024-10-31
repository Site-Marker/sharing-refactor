class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  has_many :created_projects, class_name: 'Project', inverse_of: :user
  has_many :created_reports, class_name: 'Report', inverse_of: :user
  has_many :created_documents, class_name: 'Document', inverse_of: :user

  has_many :shared_resources
  has_many :shared_projects, through: :shared_resources, source: :shareable, source_type: 'Project'
  has_many :shared_reports, through: :shared_resources, source: :shareable, source_type: 'Report'
  has_many :shared_documents, through: :shared_resources, source: :shareable, source_type: 'Document'

  def user_projects
    created_projects + shared_projects
  end
end
