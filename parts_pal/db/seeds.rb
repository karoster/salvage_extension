# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require "csv"
#the below data is in form: make, model, model_submodel, submodel, year 
arr_of_motorcycles = CSV.read(__dir__+"/ebay_motorcycle_19.csv")

data_insert = arr_of_motorcycles.map do |motorcycle|
    year = motorcycle[4]
    make = motorcycle[0]
    model = motorcycle[1]
    submodel = motorcycle[3]
    {year: year, make: make, model: model, submodel: submodel}
end

motorcycles = Motorcycle.create(data_insert)
