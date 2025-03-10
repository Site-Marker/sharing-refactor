class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  has_many :created_projects, class_name: 'Project', inverse_of: :user
  has_many :created_reports, class_name: 'Report', inverse_of: :user
  has_many :created_documents, class_name: 'Document', inverse_of: :user
  has_many :sharing_permissions
  
end
