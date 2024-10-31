class SharedResource < ApplicationRecord
  belongs_to :user
  belongs_to :shareable, polymorphic: true

  enum permission_level: { edit: "edit", full_access: "full_access",  view: "view" }

  validates :permission_level, presence: true
  validates :user_id, presence: true
end
