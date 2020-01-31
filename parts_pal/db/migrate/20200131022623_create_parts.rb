class CreateParts < ActiveRecord::Migration[6.0]
  def change
    create_table :parts do |t|
      t.string :cart_id, null: false
      t.text :part_id, null: false
      t.string :sale_type, null: false
      t.string :sale_price, null: false
      t.timestamps
    end
    add_index :parts, :cart_id, unique: true
  end
end
