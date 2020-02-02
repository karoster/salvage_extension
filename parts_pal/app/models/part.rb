class Part < ApplicationRecord
    validates :cart_id, :part_id, :sale_type, :sale_price, null: false
end

