
# frozen_string_literal: true

require 'rails_helper'

describe ProjectsController, type: :request do

    let(:user) { create(:user) }

    before do
        sign_in(user) if user
    end

    describe 'GET /projects' do
        let!(:project) { create(:project, user:) if user }
        let(:other_user_project) { create(:project) }

        it 'returns successful' do
            get '/projects.json'
            expect(response).to be_successful
        end

        it 'returns a project' do
            get '/projects.json'
            expect(JSON.parse(response.body).first['name']).to eq(project.name)
        end

        it 'returns only current users project' do
            get '/projects.json'
            expect(JSON.parse(response.body).length).to eq(1)
        end

        context 'when user has shared projects' do
            let(:shared_project) { create(:project) }
            let(:shared_resource) { create(:shared_resource, shareable: shared_project, user: user) }

            before { shared_resource }

            it 'returns shared projects' do
                get '/projects.json'
                expect(JSON.parse(response.body).length).to eq(2)
            end
        end

        context 'when user is not signed in' do
            let(:user) { nil }
            let!(:project) { create(:project)}

            it 'returns unauthorized' do
                get '/projects.json'
                expect(response).to be_unauthorized
            end
        end
    end

    describe 'POST /projects' do
        it 'creates a project' do
            expect {
                post '/projects.json', params: { project: { name: 'New Project', description: 'New description' } }
            }.to change(Project, :count).by(1)
        end

        context 'when project is invalid' do
            it 'returns unprocessable entity' do
                post '/projects.json', params: { project: { name: '' } }
                expect(response).to be_unprocessable
            end
        end

        context 'when user is not signed in' do
            let(:user) { nil }

            it 'returns unauthorized' do
                post '/projects.json', params: { project: { name: 'New Project', description: 'New description' } }
                expect(response).to be_unauthorized
            end
        end
    end

    describe 'GET /projects/:id' do
        let(:project) { create(:project, user:) }

        it 'returns successful' do
            get "/projects/#{project.id}.json"
            expect(response).to be_successful
        end

        it 'returns the project' do
            get "/projects/#{project.id}.json"
            expect(JSON.parse(response.body)['id']).to eq(project.id)
        end

        context 'when another user owns the project' do
            let(:project) { create(:project) }

            it 'returns not found' do
                get "/projects/#{project.id}.json"
                expect(response).to be_not_found
            end
        end

        context 'when user is not signed in' do
            let(:user) { nil }
            let(:project) { create(:project) }

            it 'returns unauthorized' do
                get "/projects/#{project.id}.json"
                expect(response).to be_unauthorized
            end
        end
    end

    describe 'PUT /projects/:id' do
        let(:project) { create(:project, user:) }

        it 'updates a project' do
            put "/projects/#{project.id}.json", params: { project: { name: 'Updated Project' } }
            expect(response).to be_successful
            expect(Project.find(project.id).name).to eq('Updated Project')
        end

        context 'when project is invalid' do
            it 'returns unprocessable entity' do
                put "/projects/#{project.id}.json", params: { project: { name: '' } }
                expect(response).to be_unprocessable
            end
        end

        context 'when another user owns the project' do
            let(:project) { create(:project) }

            it 'returns not found' do
                put "/projects/#{project.id}.json", params: { project: { name: 'Updated Project' } }
                expect(response).to be_not_found
            end
        end

        context 'when user is not signed in' do
            let(:user) { nil }
            let(:project) { create(:project) }

            it 'returns unauthorized' do
                put "/projects/#{project.id}.json", params: { project: { name: 'Updated Project' } }
                expect(response).to be_unauthorized
            end
        end
    end

    describe 'DELETE /projects/:id' do
        let(:project) { create(:project, user:) }

        it 'deletes a project' do
            delete "/projects/#{project.id}.json"
            expect(response).to be_successful
        end

        it 'removes the project' do
            delete "/projects/#{project.id}.json"
            expect(Project.find_by(id: project.id)).to be_nil
        end

        context 'when another user owns the project' do
            let(:project) { create(:project) }

            it 'returns not found' do
                delete "/projects/#{project.id}.json"
                expect(response).to be_not_found
            end
        end

        context 'when user is not signed in' do
            let(:user) { nil }
            let(:project) { create(:project) }

            it 'returns unauthorized' do
                delete "/projects/#{project.id}.json"
                expect(response).to be_unauthorized
            end
        end
    end
end
