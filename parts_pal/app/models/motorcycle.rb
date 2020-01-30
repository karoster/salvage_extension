class Motorcycle < ApplicationRecord
    validates :year, :make, :model, null: false
    validates_uniqueness_of :model, :scope => [ :year, :make ]

end