class CreateSharingPermissions < ActiveRecord::Migration[7.1]
  def change
    create_table :sharing_permissions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.references :project, foreign_key: true
      t.references :document, foreign_key: true
      t.references :report, foreign_key: true
      t.string :resource_type, null: false

      t.timestamps
    end
  end
end
