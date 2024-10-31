class SharedResourcesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_shared_resource, only: %i[ show ]

  def create
    @shared_resource = SharedResource.new(shared_resource_params)

     respond_to do |format|
      if @shared_resource.save
        format.html { redirect_to @shared_resource, notice: "Resource shared successfully " }
        format.json { render :show, status: :created, location: @shared_resource }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @shared_resource.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_permission
    shared_resource = SharedResource.find_by(shareable_id: params[:resource_id], user_id: params[:user_id], shareable_type: params[:resource_type])

    if shared_resource.nil?
      render json: { error: "Shared resource not found" }, status: :not_found and return
    end

    # Update permission level if found
    permission_level = params.dig(:shared_resource,:permission_level)
    if shared_resource.update(permission_level:)
      render json: { message: "Permission updated successfully", shared_resource: shared_resource }, status: :ok
    else
      render json: { error: shared_resource.errors.full_messages }, status: :unprocessable_entity
    end

  end

  def show
  end

  private

  def shared_resource_params
    params.require(:shared_resource).permit(:shareable_id, :shareable_type, :user_id, :permission_level)
  end

  def set_shared_resource
    @shared_resource = SharedResource.find(params[:id])
  end
end