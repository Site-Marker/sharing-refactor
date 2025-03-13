class ReportsController < ApiController
  before_action :authenticate_user!
  before_action :set_project, only: %i[ index create ]
  before_action :set_report, only: %i[ edit update destroy ]
  before_action :set_view_report, only: %i[ show ]

  # GET /reports or /reports.json
  def index
    @reports = @project ? @project.reports : current_user.created_reports.all
  end

  # GET /reports/1 or /reports/1.json
  def show
  end

  # GET /reports/new
  def new
    @report = Report.new
  end

  # GET /reports/1/edit
  def edit
  end

  # POST /reports or /reports.json
  def create
    @report = @project ? @project.reports.build(report_params) : current_user.created_reports.build(report_params)
    @report.user = current_user if @project

    respond_to do |format|
      if @report.save
        format.html { redirect_to @report, notice: "Report was successfully created." }
        format.json { render :show, status: :created, location: @report }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @report.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /reports/1 or /reports/1.json
  def update
    respond_to do |format|
      if @report.update(report_params)
        format.html { redirect_to @report, notice: "Report was successfully updated." }
        format.json { render :show, status: :ok, location: @report }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @report.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /reports/1 or /reports/1.json
  def destroy
    @report.destroy!

    respond_to do |format|
      format.html { redirect_to reports_path, status: :see_other, notice: "Report was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

    def set_project
      shared = params[:shared]
      if shared.present? && shared == 'true'
        project = Project.find(params[:project_id])

        if project.nil?
          render json: { error: "Resource not found" }, status: :not_found
          return
        end

        view_access_check = SharingPermission.exists?(
          user_id: current_user.id,
          resource_type: 'project',
          project_id: params[:project_id]
        )

        unless view_access_check
          render json: { error: "Unauthorized: You do not have permission to view for this resource" }, status: :unauthorized
          return
        end

        @project = project
      else
        @project = current_user.created_projects.find(params[:project_id]) if params[:project_id]
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_report
      @report = current_user.created_reports.find(params[:id])
    end

    def set_view_report
      shared = params[:shared]
      report = Report.find(params[:id])

      if report.nil?
        render json: { error: "Resource not found" }, status: :not_found
        return
      end

      if shared.present? && shared == 'true'
        view_access_check = SharingPermission.exists?(
          user_id: current_user.id,
          resource_type: 'report',
          report_id: report.id
        ) || SharingPermission.exists?(
          user_id: current_user.id,
          resource_type: 'project',
          project_id: report.project_id
        )

        unless view_access_check
          render json: { error: "Unauthorized: You do not have permission to view for this resource" }, status: :unauthorized
          return
        end

        @report = report
      else 
        @report = current_user.created_reports.find(params[:id])
      end

    end

    # Only allow a list of trusted parameters through.
    def report_params
      params.require(:report).permit(:title)
    end
end
