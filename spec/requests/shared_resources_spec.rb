require 'rails_helper'

RSpec.describe "SharedResources", type: :request do
  describe 'POST /shared_resources' do
    let(:user) { create(:user) }
    let!(:project) { create(:project, user:) }
    let(:other_user_project) { create(:project) }

    describe 'when user is signed in' do
      before do
          sign_in(user)
      end

      context 'when shared resource is valid' do
        it 'creates a shared resource' do
            expect {
                post '/shared_resources.json', params: { shared_resource: { shareable_id: project.id, shareable_type: 'Project', user_id: user.id, permission_level: 'full_access' } }
            }.to change(SharedResource, :count).by(1)
        end
      end

      context 'when shared resource is invalid' do
        it 'returns unprocessable entity' do
            post '/shared_resources.json', params: { shared_resource: { shareable_id: project.id, shareable_type: 'Project', user_id: user.id, permission_level: '' } }
            expect(response).to be_unprocessable
        end
      end
    end

    context 'when user is not signed in' do
        it 'returns unauthorized' do
            post '/shared_resources.json', params: { shared_resource: { shareable_id:  project.id, shareable_type: 'Project', user_id:  user.id, permission_level: 'full_access' } }
            expect(response).to be_unauthorized
        end
    end
  end

  describe 'PUT /shared_resources/:resource_id/:user_id/:resource_type' do
    let(:user) { create(:user) }
    let!(:project) { create(:project, user:) }
    let(:shared_resource) { create(:shared_resource, shareable: project, user: user) }

    describe 'when user is signed in' do
      before do
          sign_in(user)
      end

      context 'when shared resource is valid' do
        it 'updates a shared resource' do
            put "/shared_resources/#{project.id}/#{user.id}/Project.json", params: { shared_resource: { permission_level: 'view' } }
            expect(shared_resource.reload.permission_level).to eq('view')
        end
      end

      context 'when shared resource is invalid' do
        it 'returns unprocessable entity' do
            put "/shared_resources/#{project.id}/#{user.id}/Project.json", params: { shared_resource: { permission_level: '' } }
            expect(response).to be_not_found
        end
      end
    end

    context 'when user is not signed in' do
        it 'returns unauthorized' do
            put "/shared_resources/#{project.id}/#{user.id}/Project.json", params: { shared_resource: { permission_level: 'view' } }
            expect(response).to be_unauthorized
        end
    end
  end

  describe 'GET /shared_resources/:id' do
    let(:user) { create(:user) }
    let!(:project) { create(:project, user:) }
    let(:shared_resource) { create(:shared_resource, shareable: project, user: user) }

    describe 'when user is signed in' do
      before do
          sign_in(user)
      end

      it 'returns successful' do
          get "/shared_resources/#{shared_resource.id}.json"
          expect(response).to be_successful
      end

      it 'returns the shared resource' do
          get "/shared_resources/#{shared_resource.id}.json"
          expect(JSON.parse(response.body)['id']).to eq(shared_resource.id)
      end
    end

    context 'when user is not signed in' do
        it 'returns unauthorized' do
            get "/shared_resources/#{shared_resource.id}.json"
            expect(response).to be_unauthorized
        end
    end
  end
end
