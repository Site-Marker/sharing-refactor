class DocumentsController < ApiController
  before_action :authenticate_user!
  before_action :set_project, only: %i[index create]
  before_action :set_document, only: %i[ show edit update destroy ]

  # GET /documents or /documents.json
  def index
    @documents = @project ? @project.documents : current_user.created_documents.all
  end

  # GET /documents/1 or /documents/1.json
  def show
  end

  # GET /documents/new
  def new
    @document = Document.new
  end

  # GET /documents/1/edit
  def edit
  end

  # POST /documents or /documents.json
  def create
    @document = @project ? @project.documents.build(document_params) : current_user.created_documents.build(document_params)
    @document.user = current_user if @project

    respond_to do |format|
      if @document.save
        format.html { redirect_to @document, notice: "Document was successfully created." }
        format.json { render :show, status: :created, location: @document }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /documents/1 or /documents/1.json
  def update
    respond_to do |format|
      if @document.update(document_params)
        format.html { redirect_to @document, notice: "Document was successfully updated." }
        format.json { render :show, status: :ok, location: @document }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @document.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /documents/1 or /documents/1.json
  def destroy
    @document.destroy!

    respond_to do |format|
      format.html { redirect_to documents_path, status: :see_other, notice: "Document was successfully destroyed." }
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
    def set_document
      @document = current_user.created_documents.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def document_params
      params.require(:document).permit(:name, :project_id)
    end
end
