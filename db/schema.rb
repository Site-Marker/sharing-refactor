# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_10_31_172716) do
  create_table "documents", force: :cascade do |t|
    t.string "name"
    t.integer "project_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_documents_on_project_id"
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "reports", force: :cascade do |t|
    t.string "title"
    t.integer "project_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_reports_on_project_id"
    t.index ["user_id"], name: "index_reports_on_user_id"
  end

  create_table "shared_resources", force: :cascade do |t|
    t.string "shareable_type", null: false
    t.integer "shareable_id", null: false
    t.integer "user_id", null: false
    t.string "permission_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shareable_type", "shareable_id"], name: "index_shared_resources_on_shareable"
    t.index ["user_id"], name: "index_shared_resources_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.text "avatar_url"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "documents", "projects"
  add_foreign_key "documents", "users"
  add_foreign_key "projects", "users"
  add_foreign_key "reports", "projects"
  add_foreign_key "reports", "users"
end
