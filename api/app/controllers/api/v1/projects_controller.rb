class Api::V1::ProjectsController < ApplicationController

  # プロジェクトToDo取得（empId指定）
  def index_todo
    # 対象＝PLになっていて、計画未提出、計画書差戻、PJ推進中且つ予定期間（至）経過、完了報告書差戻
    prjs = Project
            .where(pl_id: params[:id])
            .where("(status = '計画未提出') or (status = '計画書差戻') or (status= 'PJ推進中' and development_period_to <= ?) or (status = '完了報告書差戻')", Date.today)
    render json: { status: 200, prjs: prjs }
  end


# ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑　再確認済み

  def index
#    render json: Project.all.order(:number)
    render json: Project.joins("LEFT OUTER JOIN employees AS plemp ON plemp.id=pl_id").select("projects.*, plemp.name as pl_name").order(:number)
  end

  def show
    project = Project.joins("LEFT OUTER JOIN employees AS memps ON memps.id=make_id LEFT OUTER JOIN employees AS uemps ON uemps.id=update_id LEFT OUTER JOIN employees AS plemp ON plemp.id=pl_id").select("projects.*, memps.name as make_name, uemps.name as update_name, plemp.name as pl_name").find(params[:id])
    phases = Phase.where(project_id: params[:id]).order(:number)
    risks = Risk.where(project_id: params[:id]).order(:number)
    qualitygoals = Qualitygoal.where(project_id: params[:id]).order(:number)
    members = Member.joins("LEFT OUTER JOIN employees AS emps ON emps.id=member_id").select("members.*, emps.name as member_name").where(project_id: params[:id]).order(:number)

    render json: { status: 200, prj: project, phases: phases, risks: risks, goals: qualitygoals, mems: members }
  end

  def create
    prj = Project.new(prj_params.prj)
    if prj.save then
      render json: prj
    else
      render json: { status: 500, messages: prj.errors }
    end
  end

  def update

    ActiveRecord::Base.transaction do

      prj = Project.find(params[:id])
      prj_param = prj_params[:prj]
      prj.status = prj_param[:status]
      prj.approval = prj_param[:approval]
      prj.approval_date = prj_param[:approval_date]
      prj.pl_id = prj_param[:pl_id]
      prj.number = prj_param[:number]
      prj.name = prj_param[:name]
      prj.make_date = prj_param[:make_date]
      prj.make_id = prj_param[:make_id]
      prj.update_date = prj_param[:update_date]
      prj.update_id = prj_param[:update_id]
      prj.company_name = prj_param[:company_name]
      prj.department_name = prj_param[:department_name]
      prj.personincharge_name = prj_param[:personincharge_name]
      prj.phone = prj_param[:phone]
      prj.fax = prj_param[:fax]
      prj.email = prj_param[:email]
      prj.development_period_fr = prj_param[:development_period_fr]
      prj.development_period_to = prj_param[:development_period_to]
      prj.scheduled_to_be_completed = prj_param[:scheduled_to_be_completed]
      prj.system_overview = prj_param[:system_overview]
      prj.development_environment = prj_param[:development_environment]
      prj.order_amount = prj_param[:order_amount]
      prj.planned_work_cost = prj_param[:planned_work_cost]
      prj.planned_workload = prj_param[:planned_workload]
      prj.planned_purchasing_cost = prj_param[:planned_purchasing_cost]
      prj.planned_outsourcing_cost = prj_param[:planned_outsourcing_cost]
      prj.planned_outsourcing_workload = prj_param[:planned_outsourcing_workload]
      prj.planned_expenses_cost = prj_param[:planned_expenses_cost]
      prj.gross_profit = prj_param[:gross_profit]
      prj.work_place_kbn = prj_param[:work_place_kbn]
      prj.work_place = prj_param[:work_place]
      prj.customer_property_kbn = prj_param[:customer_property_kbn]
      prj.customer_property = prj_param[:customer_property]
      prj.customer_environment = prj_param[:customer_environment]
      prj.purchasing_goods_kbn = prj_param[:purchasing_goods_kbn]
      prj.purchasing_goods = prj_param[:purchasing_goods]
      prj.outsourcing_kbn = prj_param[:outsourcing_kbn]
      prj.outsourcing = prj_param[:outsourcing]
      prj.customer_requirement_kbn = prj_param[:customer_requirement_kbn]
      prj.customer_requirement = prj_param[:customer_requirement]
      prj.remarks = prj_param[:remarks]
      prj.save!
      
      prj_params[:phases].map do |phase_param|
        if phase_param[:del].blank? then
          phase = Phase.find_or_initialize_by(id: phase_param[:id])
          phase.project_id = params[:id]
          phase.number = phase_param[:number]
          phase.name = phase_param[:name]
          phase.planned_periodfr = phase_param[:planned_periodfr]
          phase.planned_periodto = phase_param[:planned_periodto]
          phase.deliverables = phase_param[:deliverables]
          phase.criteria = phase_param[:criteria]
          phase.save!
        else
          if phase_param[:id].blank? then
          else
            phase = Phase.find(phase_param[:id])
            phase.destroy!
          end
        end
      end

      risk_num = 0
      prj_params[:risks].map do |risk_param|
        if risk_param[:del].blank? then
          risk_num += 1
          risk = Risk.find_or_initialize_by(id: risk_param[:id])
          risk.project_id = params[:id]
          risk.number = risk_num
          risk.contents = risk_param[:contents]
          risk.save!
        else
          if risk_param[:id].blank? then
          else
            risk = Risk.find(risk_param[:id])
            risk.destroy!
          end
        end
      end

      goal_num = 0
      prj_params[:goals].map do |goal_param|
        if goal_param[:del].blank? then
          goal_num += 1
          goal = Qualitygoal.find_or_initialize_by(id: goal_param[:id])
          goal.project_id = params[:id]
          goal.number = goal_num
          goal.contents = goal_param[:contents]
          goal.save!
        else
          if goal_param[:id].blank? then
          else
            goal = Qualitygoal.find(goal_param[:id])
            goal.destroy!
          end
        end
      end

      mem_num = 0
      prj_params[:mems].map do |mem_param|
        if mem_param[:del].blank? then
          mem_num += 1
          mem = Member.find_or_initialize_by(id: mem_param[:id])
          mem.project_id = params[:id]
          mem.number = mem_num
          mem.level = mem_param[:level]
          mem.member_id = mem_param[:member_id]
          mem.save!
        else
          if mem_param[:id].present? then
            mem = Member.find(mem_param[:id])
            mem.destroy!
          end
        end
      end

      if prj_params[:log].present? then
        log_param = prj_params[:log]
        log = Changelog.new()
        log.project_id = params[:id]
        log.changer_id = log_param[:changer_id]
        log.change_date = log_param[:change_date]
        log.contents = log_param[:contents]
        log.save!
      end
      
    end

    render json: { status: 200, message: "Update Success!" }

  rescue => e

    render json: { status: 500, message: "Update Error"}

  end

  def destroy
    prj = Project.find(params[:id])
    prj.destroy
    render json: prj
  end

  # パラメータ指定の社員が参画するプロジェクトで、パラメータ指定の日付が開発期間内の一覧
  def index_by_member
    projects = Project
                .joins(:members)
                .select("projects.id, projects.number, projects.name")
                .where(members: { level: 'emp', member_id: params[:emp_id] })
                .where("development_period_fr <= ? and development_period_to >= ?", params[:thisDate], params[:thisDate])
                .order(:number)
    render json: { status: 200, projects: projects }
  end

  # パラメータ指定の社員が参画する推進中のプロジェクト一覧
  def index_by_member_running
    projects = Project
                .joins("LEFT OUTER JOIN employees AS plemp ON plemp.id=pl_id")
                .joins(:members)
                .select("projects.*, plemp.name as pl_name")
                .where(members: { level: 'emp', member_id: params[:id] })
                .where(projects: { status: 'PJ推進中'})
                .order(:number)
    render json: { status: 200, projects: projects }
  end

  # 条件指定でのプロジェクト一覧 
  def index_by_conditional
    where = ""

    # 状態の条件指定あり
    if params[:status].present? then
      where = "projects.status='" + params[:status] + "' "
    end

    # PLの条件指定あり
    if params[:pl].present? then
      where += "projects.pl_id=" + params[:pl] + " "
    end

    # 並び順指定
    if params[:order].present? then
      order = "projects." + params[:order]
    else
      order = "projects.number"
    end

    projects = Project
                .joins("LEFT OUTER JOIN employees AS plemp ON plemp.id=pl_id")
                .select("projects.*, plemp.name as pl_name")
                .where(where)
                .order(order)
    render json: { status: 200, projects: projects }
  end

  private
  def prj_params
    params.permit(prj: [:status, :approval, :approval_date, :pl_id, :number, :name, 
      :make_date, :make_id, :update_date, :update_id, :company_name, :department_name, 
      :personincharge_name, :phone, :fax, :email, :development_period_fr, :development_period_to, 
      :scheduled_to_be_completed, :system_overview, :development_environment, 
      :order_amount, :planned_work_cost, :planned_workload, :planned_purchasing_cost, 
      :planned_outsourcing_cost, :planned_outsourcing_workload, :planned_expenses_cost, :gross_profit, 
      :work_place_kbn, :work_place, :customer_property_kbn, :customer_property, :customer_environment, 
      :purchasing_goods_kbn, :purchasing_goods, :outsourcing_kbn, :outsourcing, 
      :customer_requirement_kbn, :customer_requirement, :remarks, :plan_approval, :plan_approval_date],
      phases: [:id, :project_id, :number, :name, :planned_periodfr, :planned_periodto, :deliverables, :criteria, :del],
      risks: [:id, :project_id, :number, :contents, :del],
      goals: [:id, :project_id, :number, :contents, :del],
      mems: [:id, :project_id, :number, :level, :member_id, :del],
      log: [:changer_id, :change_date, :contents]
    
    )
  end
end
