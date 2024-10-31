require 'rails_helper'

RSpec.describe SharedResource, type: :model do
  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:shareable) }
  end

  describe 'validations' do
    it { should validate_presence_of(:permission_level) }
    it { should validate_presence_of(:user_id) }
  end

  describe 'permission_levels' do
    it 'defines the correct enum values for permission_level' do
      expect(SharedResource.permission_levels).to eq({
        'full_access' => 'full_access',
        'edit' => 'edit',
        'view' => 'view'
      })
    end
  end
end
