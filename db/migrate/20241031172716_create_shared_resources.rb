class CreateSharedResources < ActiveRecord::Migration[7.1]
  def change
    create_table :shared_resources do |t|
      t.references :shareable, polymorphic: true, null: false
      t.references :user, null: false
      t.string :permission_level

      t.timestamps
    end
  end
end
