class Api::V1::PartsController < ApplicationController
  protect_from_forgery except: :create


    def index
      cart_object = {}
      total = 0
      part_list = Part.where(query_params).pluck(:part_id, :sale_price, :sale_type)
      part_list.each do |id, sp, st|
        total += sp.to_f
        cart_object[id] = [sp, st]
      end

      if part_list.length() > 0
        render json: {parts: cart_object, total: total,  error: false}
      else
        render json: {error: true}
      end
    end

    def create

      begin
        cart_id = SecureRandom.urlsafe_base64
        Part.transaction do 
          part_params['part'].each do |part|
            part['cart_id'] = cart_id
            Part.create!(part)
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
  