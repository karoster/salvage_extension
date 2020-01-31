class Part < ApplicationRecord
    validates :cart_id, :part_id, :sale_type, :sale_price, null: false
    validates_uniqueness_of :cart_id

end