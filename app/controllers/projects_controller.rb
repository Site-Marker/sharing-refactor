class ProjectsController < ApiController
  before_action :authenticate_user!
  before_action :set_project, only: %i[ edit update destroy ]
  before_action :set_view_project, only: %i[ show ]

  # GET /projects or /projects.json
  def index
    shared = params[:shared]
    if shared.present? && shared == 'true'
      shared_projects = SharingPermission.where(
        user_id: current_user.id,
        resource_type: 'project'
      ).includes(:project).map(&:project).compact

      @projects = shared_projects.uniq
    else 
      @projects = current_user.created_projects.all
    end
    
  end

  # GET /projects/1 or /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    @project = Project.new
  end

  # GET /projects/1/edit
  def edit
  end

  # POST /projects or /projects.json
  def create
    @project = current_user.created_projects.build(project_params)

    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: "Project was successfully created." }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1 or /projects/1.json
  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to @project, notice: "Project was successfully updated." }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1 or /projects/1.json
  def destroy
    @project.destroy!

    respond_to do |format|
      format.html { redirect_to projects_path, status: :see_other, notice: "Project was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_view_project
      shared = params[:shared]
      project = Project.find(params[:id])

      if project.nil?
        render json: { error: "Resource not found" }, status: :not_found
        return
      end

      if shared.present? && shared == 'true'
        view_access_check = SharingPermission.exists?(
          user_id: current_user.id,
          project_id: params[:id],
          resource_type: 'project',
        )

        unless view_access_check
          render json: { error: "Unauthorized: You do not have permission to view for this resource" }, status: :unauthorized
          return
        end

        @project = project
      else 
        @project = current_user.created_projects.find(params[:id])
      end
      
    end

    def set_project
      @project = current_user.created_projects.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def project_params
      params.require(:project).permit(:name, :description)
    end
end
