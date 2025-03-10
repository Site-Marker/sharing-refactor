json.extract! project, :id, :name, :description, :user_id, :created_at, :updated_at, :sharing_permissions
json.sharing_permissions project.sharing_permissions do |permission|
    json.extract! permission.user, :id, :name, :email, :avatar_url
    json.permission permission.access_level
end
json.url project_url(project, format: :json)
