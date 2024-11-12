class AddRolesToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :projectRole, :string
    add_column :users, :reportRole, :string
    add_column :users, :documentRole, :string
  end
end
