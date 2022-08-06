class Api::V1::ApprovalauthsController < ApplicationController
  def index
    auth = Approvalauth.joins("LEFT OUTER JOIN employees AS emps ON emps.id=employee_id LEFT OUTER JOIN divisions AS divs ON divs.id=division_id LEFT OUTER JOIN departments AS deps ON deps.id=divs.department_id").select("approvalauths.*,emps.number AS emp_no,emps.name AS emp_name, deps.number AS dep_no, deps.name AS dep_name, divs.number AS div_no, divs.name AS div_name").order("emp_no,dep_no,div_no")
    render jeson: { status: 200, auth: auth }
  end

  def create
    auth = Approvalauth.new(auth_params)
    if auth.save
      render json: { status: 200, message: "Insert Success!" }
    else
      render json: {status: 500, message: "Insert Error" }
    end
  end

  def destroy
    auth = Approvalauth.find(params[:id])
    auth.destroy
    render json: auth  
  end

  private
  def auth_params
    params.require(:approvalauth).permit(:employee_id, :division_id)
  end

end

