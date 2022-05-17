class Api::V1::ChangelogsController < ApplicationController
  
  def index_by_project
    changelogs = Changelog.joins("LEFT OUTER JOIN employees AS emps ON emps.id=changer_id").select("changelogs.*, emps.name as changer_name").where(project_id: params[:project_id]).order(:change_date)
    render json: { status: 200, changelogs: changelogs }
  end

  def create
    changelog = Changelog.new(changelog_params)
    if changelog.save
      render json: { status: 200, message: "Addition Success" }
    else
      render json: { status: 500, message: "Addition Error" }
    end
  end

  private
  def changelog_params
    params.permit(changelog: [:project_id, :number, :changer_id, :change_date, :contents ])
  end
end
