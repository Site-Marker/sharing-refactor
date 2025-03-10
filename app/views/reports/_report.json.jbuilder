json.extract! report, :id, :title, :project_id, :created_at, :updated_at
json.sharing_permissions report.sharing_permissions do |permission|
    json.extract! permission.user, :id, :name, :email, :avatar_url
    json.permission permission.access_level
end
json.url report_url(report, format: :json)
