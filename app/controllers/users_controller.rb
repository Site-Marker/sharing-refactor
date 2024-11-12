class UsersController < ApplicationController
    before_action :authenticate_user!
    
    def index
        @users = User.where.not(id: current_user.id)
    end

    def current
        @user = current_user
    end

    # def update
    #     @user = User.find(params[:id])
    #     if @user.update(user_params)
    #         redirect_to @user, notice: "User was successfully updated."
    #     else
    #         redirect_to edit_user_path(@user), alert: "Failed to update user."
    #     end
    # end

    # # Only allow a list of trusted parameters through.
    # def user_params
    #     params.require(:id).permit(:user_id)
    # end

end
  

