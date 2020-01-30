class Api::V1::MotorcyclesController < ApplicationController
  def index
    print(params)
    tester = Motorcycle.where(query_params)
    render json: tester
  end


  private

  def query_params
    params.permit(:make, :model, :year)
  end
end
