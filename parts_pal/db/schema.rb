# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_01_31_022623) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "motorcycles", force: :cascade do |t|
    t.string "year", null: false
    t.string "make", null: false
    t.string "model", null: false
    t.string "submodel"
    t.index ["year", "make", "model"], name: "index_motorcycles_on_year_and_make_and_model", unique: true
  end

  create_table "parts", force: :cascade do |t|
    t.string "cart_id", null: false
    t.text "part_id", null: false
    t.string "sale_type", null: false
    t.string "sale_price", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["cart_id"], name: "index_parts_on_cart_id", unique: true
  end

end
