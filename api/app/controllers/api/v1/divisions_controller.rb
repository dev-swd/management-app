class Api::V1::DivisionsController < ApplicationController

  def index
    render json: Division.joins(:department).select("departments.code AS dep_code, departments.name AS dep_name, divisions.*").order("departments.code, divisions.code")
  end

  def show
    render json: Division.joins(:department).select("departments.code AS dep_code, departments.name AS dep_name, divisions.*").find(params[:id])
  end

  def create
    div = Division.new(div_params)
    if div.save
      render json: { status: 200, div: div }
    else
      render json: {status: 500, div: div }
    end
  end

  def update
    div = Division.find(params[:id])
    if div.update(div_params)
      render json: { status: 200, div: div }
    else
      render json: {status: 500, div: div }
    end
  end

  def destroy
    div = Division.find(params[:id])
    div.destroy
    render json: div
  end

  def filterdepid
    divisions =Division.where(department_id: params[:depid])
    render json: divisions.order("divisions.code")
  end

  private
  def div_params
    params.require(:division).permit(:code, :name, :department_id)
  end

end
