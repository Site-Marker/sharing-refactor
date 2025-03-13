class AddAccessLevelToSharingPermissions < ActiveRecord::Migration[7.1]
  def change
    add_column :sharing_permissions, :access_level, :string
  end
end
