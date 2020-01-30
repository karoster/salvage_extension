class CreateMotorcycles < ActiveRecord::Migration[6.0]
  def change
    create_table :motorcycles do |t|
      t.string :year, null: false
      t.string :make, null: false
      t.string :model, null: false
      t.string :submodel
    end
    add_index :motorcycles, [:year, :make, :model], :unique => true
  end
end
