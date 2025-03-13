require 'rails_helper'

RSpec.describe "SharingPermissions", type: :request do
  let(:user) { create(:user) }
    
  before do
      sign_in(user) if user
  end

  describe "GET /" do

    it "returns http success" do
      get "/sharing_permission"
      expect(response).to have_http_status(:success)
    end
  end

end
