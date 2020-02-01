class Api::V1::PartsController < ApplicationController
  protect_from_forgery except: :create


    def index
      print(params)
      print(debug(params))
      print(query_params)
      part_list = Part.where(query_params)
      render json: part_list
    end

    def create
      print(params)
    end
  
  
    private
    
    # for get request
    def query_params
      params.permit(:cart_id)
    end

    # for post request
    def part_params
      params.permit({parts: [:part_id, :sale_type, :sale_price]})
    end
  end
  