class Api::V1::PhasesController < ApplicationController
  def index
    render json: Phase.all.order(:number)
  end

  def show
    render json: Phase.find(params[:id])
  end
    
  def create
    ph = Phase.new(ph_params)
    if ph.save
      render json: ph
    else
      render json: { status: 500, messages: ph.errors }
    end
  end

  def update
    ph = Phase.find(params[:id])
    if ph.update(ph_params)
      render json: ph
    else
      render json: {status: 500, messages: ph.errors }
    end
  end

  def destroy
    ph = Phase.find(params[:id])
    ph.destroy
    render json: ph
  end

  private
  def ph_params
    params.require(:phase).permit(:project_id, :number, :name, :deliverables, :criteria, 
                                :planned_periodfr, :planned_periodto, :actual_periodfr, :actual_periodto, 
                                :planned_cost, :planned_workload, :actual_cost, :actual_workload,
                                :ship_number, :accept_comp_date)
  end
end
