class Part < ApplicationRecord
    validates :cart_id, :part_id, :sale_type, :sale_price, null: false
    validates_uniqueness_of :cart_id
    after_initialize :ensure_cart_id
end


def ensure_cart_id
    self.cart_id ||= SecureRandom.urlsafe_base64
end