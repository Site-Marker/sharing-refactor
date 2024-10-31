# frozen_string_literal: true

require 'rails_helper'

describe User, type: :model do
    describe 'associations' do
        it { should have_many(:created_projects).class_name('Project').inverse_of(:user) }
        it { should have_many(:created_reports).class_name('Report').inverse_of(:user) }
        it { should have_many(:created_documents).class_name('Document').inverse_of(:user) }
    end

    describe "#user_projects" do
        let!(:user) { create(:user) }
        let!(:created_project) { create(:project, user:) }

        context 'when user has no shared projects' do
            it "returns only the user's created projects" do
                expect(user.user_projects).to eq([created_project])
            end
        end

        context 'when user has shared projects' do
            let(:shared_project) { create(:project) }
            let(:shared_resource) { create(:shared_resource, shareable: shared_project, user: user) }

            before { shared_resource }

            it "returns the user's created projects and shared projects" do
                expect(user.user_projects).to eq([created_project, shared_project])
            end
        end

        context 'when another user tries to access shared projects' do
            let(:another_user) { create(:user) }
            let(:shared_project) { create(:project) }
            let(:shared_resource) { create(:shared_resource, shareable: shared_project, user: user) }

            before { shared_resource }

            it "does not return the shared project" do
                expect(another_user.user_projects).to eq([])
            end
        end
    end
  end
