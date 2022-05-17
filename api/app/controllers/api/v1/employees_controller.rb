class Api::V1::EmployeesController < ApplicationController

  def index
#    render json: Employee.all.order(:number)
    render json: Employee.joins("LEFT OUTER JOIN divisions AS divs ON divs.id=division_id LEFT OUTER JOIN departments AS deps ON deps.id=divs.department_id").select("employees.*, divs.name as div_name, deps.name as dep_name").all.order(:number)
  end

  def show
#    render json: Employee.find(params[:id])
    render json: Employee.joins("LEFT OUTER JOIN divisions AS divs ON divs.id=division_id LEFT OUTER JOIN departments AS deps ON deps.id=divs.department_id").select("employees.*, divs.name as div_name, deps.name as dep_name").find(params[:id])
  end

  def create
#    emp = Employee.new(emp_params)
#    if emp.save
#      render json: emp
#    else
#      render json: {status: 500, messages: emp.errors }
#    end
    emp = Employee.create(emp_params)
    if emp.id.present? then
      render json: { status: 200, emp: emp }
    else
      render json: {status: 500, message: "Create Error" }
    end
  end

  def update
    emp = Employee.find(params[:id])
    if emp.update(emp_params)
      render json: emp
    else
      render json: {status: 500, messages: emp.errors }
    end
  end

  def destroy
    emp = Employee.find(params[:id])
    emp.destroy
    render json: emp
  end

  def show_by_devise
    emp = Employee.joins("LEFT OUTER JOIN divisions AS divs ON divs.id=division_id LEFT OUTER JOIN departments AS deps ON deps.id=divs.department_id").select("employees.*, divs.name as div_name, deps.name as dep_name").find_by(devise_id: params[:id]);
    if emp.present? then
      render json: { status: 200, emp: emp }
    else
      render json: { status: 500, message: "No Data"}
    end
  end

  private
  def emp_params
    params.require(:employee).permit(:number, :name, :name2, :birthday, :address, :phone, :joining_date, :division_id, :devise_id, :authority)
  end

end
