class Api::V1::DepartmentsController < ApplicationController

  def index
    render json: Department.all.order(:code)
  end

  def show
    render json: Department.find(params[:id])
  end

  def create
    dep = Department.new(dep_params)
    if dep.save
      render json: dep
    else
      render json: {status: 500, messages: dep.errors }
    end
  end

  def update
    dep = Department.find(params[:id])
    if dep.update(dep_params)
      render json: dep
    else
      render json: {status: 500, messages: dep.errors }
    end
  end

  def destroy
    dep = Department.find(params[:id])
    dep.destroy
    render json: dep
  end

  private
  def dep_params
    params.require(:department).permit(:code, :name)
  end

end
