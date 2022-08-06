class Api::V1::TasksController < ApplicationController

  # PhaseIdを条件とした一覧取得（工程情報を別途添付）
  def index_by_phase
    phase = Phase
            .joins("LEFT OUTER JOIN projects AS prj ON prj.id=project_id")
            .select("prj.number as prj_number, prj.name as prj_name, phases.*")
            .find(params[:id])
    tasks = Task
            .joins(:phase)
            .joins("LEFT OUTER JOIN employees AS emp ON emp.id=worker_id")
            .select("tasks.*, emp.name as worker_name, phases.name as phase_name")
            .where(phase_id: params[:id])
            .order(:number)
    render json: { status: 200, phase: phase, tasks: tasks }
  end

  # ProjectIdを条件とした一覧取得（工程名付）
  def index_by_project
    tasks = Task
            .joins(phase: :project)
            .joins("LEFT OUTER JOIN employees AS emp ON emp.id=worker_id")
            .select("tasks.*, emp.name as worker_name, phases.name as phase_name")
            .where(projects: { id: params[:id]})
            .order(:number)
    render json: { status: 200, tasks: tasks }
  end
  
  # タスク作成時の登録処理
  def update_for_planned
    ActiveRecord::Base.transaction do

      task_num = 0
      task_params[:tasks].map do |task_param|
        if task_param[:del].blank? then
          task_num += 1
          task = Task.find_or_initialize_by(id: task_param[:id])
          task.phase_id = params[:id]
          task.number = task_num
          task.name = task_param[:name]
          task.worker_id = task_param[:worker_id]
          task.outsourcing = task_param[:outsourcing]
          task.planned_workload = task_param[:planned_workload]
          task.planned_periodfr = task_param[:planned_periodfr]
          task.planned_periodto = task_param[:planned_periodto]
          task.save!
        else
          if task_param[:id].present? then
            task = Task.find(task_param[:id])
            task.destroy!
          end
        end
      end
    end
    
    render json: { status:200, message: "Update Success!"}

  rescue => e

    render json: { status:500, message: "Update Error"}

  end


  # タスク実績日付更新
  def update_for_actualdate
    ActiveRecord::Base.transaction do

      task_params[:tasks].map do |task_param|
        task = Task.find(task_param[:id])
        task.actual_periodfr = task_param[:actual_periodfr]
        task.actual_periodto = task_param[:actual_periodto]
        task.save!
      end

    end

    render json: { status:200, message: "Update Success!"}

  rescue => e

    render json: { status:500, message: "Update Error"}

  end

  private
  def task_params
    params.permit(tasks: [:id, :name, :worker_id, :outsourcing, 
                          :planned_workload, :planned_periodfr, :planned_periodto,
                          :actual_workload, :actual_periodfr, :actual_periodto, :del])
  end
end
