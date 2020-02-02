class RemoveUniqueConstraint < ActiveRecord::Migration[6.0]
  def change
    remove_index :parts, :cart_id
    add_index :parts, :cart_id
  end
end
