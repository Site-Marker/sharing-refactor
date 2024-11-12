# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

[{
    "name": "Tyler Durden",
    "avatar_url": "https://avatar.iran.liara.run/username?username=tyler+durden",
    "email": "tylerdurden@example.com",
    "password": "testing123",
    "projectRole": "admin",
    "documentRole": "admin",
    "reportRole": "admin"
},
{
    "name": "Jack Durden",
    "avatar_url": "https://avatar.iran.liara.run/username?username=jack+durden",
    "email": "jackdurden@example.com",
    "password": "testing123",
    "projectRole": "edit",
    "documentRole": "edit",
    "reportRole": "edit"
},
{
    "name": "Marla Singer",
    "avatar_url": "https://avatar.iran.liara.run/username?username=marla+singer",
    "email": "marlasinger@example.com",
    "password": "testing123",
    "projectRole": "view",
    "documentRole": "view",
    "reportRole": "edit"
},
{
    "name": "Robert Paulson",
    "avatar_url": "https://avatar.iran.liara.run/username?username=robert+paulson",
    "email": "robertpaulson@example.com",
    "password": "testing123",
    "projectRole": "admin",
    "documentRole": "admin",
    "reportRole": "admin"
}].each do |user|
    User.create(user)
end

[{
    "name": "Project Mayhem",
    "description": "The first rule of Fight Club is: You do not talk about Fight Club.",

}].each do |project|
    User.find_by(email: "robertpaulson@example.com").created_projects.find_or_create_by!(project)
end

[{
    "title": "Urban Disruption: Phases and Protocols",
},
{
    "title": "The Art of Self-Deception",
}, 
{
    "title": "Chaos Theory Applied to Modern Society",
}].each do |report|
    user = User.find_by(email: "robertpaulson@example.com")
    project = user.created_projects.find_by(name: "Project Mayhem")
    project.reports.find_or_create_by!(report.merge({user_id: user.id}))
end


[{
    "name": "PM_MissionLogs_V1.docx",
}, {
    "name": "TargetAssets_List.xls ",
},{
    "name": "ProjectMayhem_Overview.pdf",
}].each do |document|
    user = User.find_by(email: "robertpaulson@example.com")
    project = user.created_projects.find_by(name: "Project Mayhem")
    project.documents.find_or_create_by!(document.merge({user_id: user.id}))
end
    
