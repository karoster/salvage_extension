class Api::V1::PartsController < ApplicationController
  protect_from_forgery except: :create


    def index
      print(params)
      print(query_params)
      part_list = Part.where(query_params)
      render json: part_list
    end

    def create

      begin
        cart_id = SecureRandom.urlsafe_base64
        Part.transaction do 
          part_params['part'].each do |part|
            part['cart_id'] = cart_id
          end
        end
      rescue StandardError => e
        render json: {message: "failed to save cart", error: true}
        return
      end

      render json: {message: "#{cart_id}", error: false}


    end
  
  
    private
    
    # for get request
    def query_params
      params.permit(:cart_id)
    end

    # for post request
    def part_params
      params.permit({part: [:part_id, :sale_type, :sale_price]})
    end
  end
  