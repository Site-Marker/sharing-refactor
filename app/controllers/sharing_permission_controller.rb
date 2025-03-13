class SharingPermissionController < ApplicationController
  before_action :authenticate_user!
  before_action :set_permission, only: %i[ show edit update ]

  # GET /sharing_permissions
  def index
    @sharing_permission = current_user.sharing_permissions.all
    render json: @sharing_permission, status: :ok
    return
  end

  def show
  end

  def edit
  end

  def update
  end

  def destroy
    resource_type = sharing_permission_params[:resource_type]
    user_id = sharing_permission_params[:user_id]

    case resource_type
    when "project"
      resource_id = sharing_permission_params[:project_id]
      resource_key = :project_id
    when "document"
      resource_id = sharing_permission_params[:document_id]
      resource_key = :document_id
    when "report"
      resource_id = sharing_permission_params[:report_id]
      resource_key = :report_id
    else
      render json: { error: "Invalid resource_type" }, status: :bad_request
      return
    end

    if resource_id.blank? || user_id.blank?
      render json: { error: "#{resource_key}, user_id, are required" }, status: :bad_request
      return
    end

    sharing_permission = SharingPermission.find_by(user_id: user_id, resource_key => resource_id, resource_type: resource_type)

    if sharing_permission.nil?
      render json: { error: "Permission not found" }, status: :not_found
      return
    end

    if sharing_permission.destroy
      render json: { message: "Permission destroyed." }, status: :ok
    else
      render json: { error: sharing_permission.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def create
    resource_type = sharing_permission_params[:resource_type]
    user_id = sharing_permission_params[:user_id]
    access_level = sharing_permission_params[:access_level]

    case resource_type
    when "project"
      resource_id = sharing_permission_params[:project_id]
      resource_key = :project_id
      resource_class = Project
    when "document"
      resource_id = sharing_permission_params[:document_id]
      resource_key = :document_id
      resource_class = Document
    when "report"
      resource_id = sharing_permission_params[:report_id]
      resource_key = :report_id
      resource_class = Report
    else
      render json: { error: "Invalid resource_type" }, status: :bad_request
      return
    end

    if resource_id.blank? || user_id.blank? || access_level.blank?
      render json: { error: "#{resource_key}, user_id, and access_level are required" }, status: :bad_request
      return
    end

    resource = resource_class.find_by(id: resource_id)

    if resource.nil?
      render json: { error: "Resource not found" }, status: :not_found
      return
    end

    owner_check = resource.user_id == current_user.id

    full_access_check = SharingPermission.exists?(
      user_id: current_user.id,
      resource_key => resource_id,
      resource_type: resource_type,
      access_level: 'full access'
    )

    unless owner_check || full_access_check
      render json: { error: "Unauthorized: You do not have permission to manage sharing for this resource" }, status: :unauthorized
      return
    end

    sharing_permission = SharingPermission.find_or_initialize_by(
      resource_key => resource_id,
      user_id: user_id,
      resource_type: resource_type
    )

    if sharing_permission.new_record?
      sharing_permission.creator_id = current_user.id
      sharing_permission.access_level = access_level

      if sharing_permission.save
        render json: sharing_permission, status: :created
      else
        render json: sharing_permission.errors, status: :unprocessable_entity
      end
    else
      if sharing_permission.update(access_level: access_level)
        render json: sharing_permission, status: :ok
      else
        render json: sharing_permission.errors, status: :unprocessable_entity
      end
    end
  end

  def new
    @sharing_permission = SharingPermission.new
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_permission
    @sharing_permission = current_user.sharing_permissions.find(params[:id])
  end

  def sharing_permission_params
    params.require(:sharing_permission).permit(:user_id, :project_id, :document_id, :report_id, :resource_type, :access_level)
  end
end
