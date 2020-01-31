class Api::V1::PartsController < ApplicationController
    def index
      print(params)
      tester = Motorcycle.where(query_params)
      render json: tester
    end
  
  
    private
  
    def query_params
      params.permit(:cart_id)
    end
  end
  