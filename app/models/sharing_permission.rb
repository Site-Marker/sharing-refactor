class SharingPermission < ApplicationRecord
  belongs_to :user 
  belongs_to :creator, class_name: "User"
  belongs_to :project, optional: true
  belongs_to :document, optional: true
  belongs_to :report, optional: true

  validates :resource_type, presence: true, inclusion: { in: %w[project document report] }
  validate :resource_presence

  validates :user_id, uniqueness: { scope: [:project_id, :access_level], message: "already has this access level for the project" }, if: -> { project_id.present? }
  validates :user_id, uniqueness: { scope: [:document_id, :access_level], message: "already has this access level for the document" }, if: -> { document_id.present? }
  validates :user_id, uniqueness: { scope: [:report_id, :access_level], message: "already has this access level for the report" }, if: -> { report_id.present? }

  private

  def resource_presence
    case resource_type
    when "project"
      errors.add(:project_id, "must be present") if project_id.nil?
      errors.add(:document_id, "must be nil") if document_id.present?
      errors.add(:report_id, "must be nil") if report_id.present?
    when "document"
      errors.add(:document_id, "must be present") if document_id.nil?
      errors.add(:project_id, "must be nil") if project_id.present?
      errors.add(:report_id, "must be nil") if report_id.present?
    when "report"
      errors.add(:report_id, "must be present") if report_id.nil?
      errors.add(:project_id, "must be nil") if project_id.present?
      errors.add(:document_id, "must be nil") if document_id.present?
    end
  end
end
