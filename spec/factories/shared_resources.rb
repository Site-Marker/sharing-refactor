FactoryBot.define do
  factory :shared_resource do
    shareable { project }
    user
    permission_level { 'view' }
  end
end
