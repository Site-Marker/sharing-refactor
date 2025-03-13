FactoryBot.define do
  factory :sharing_permission do
    user { nil }
    project { nil }
    document { nil }
    report { nil }
    resource_type { "MyString" }
  end
end
