json.extract! document, :id, :name, :project_id, :created_at, :updated_at
json.sharing_permissions document.sharing_permissions do |permission|
    json.extract! permission.user, :id, :name, :email, :avatar_url
    json.permission permission.access_level
end
json.url document_url(document, format: :json)
