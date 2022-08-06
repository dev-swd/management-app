class CreatePhasecopies < ActiveRecord::Migration[6.1]
  def change
    create_table :phasecopies do |t|
      t.references :progressreport, index: true, foreign_key: true
      t.bigint "phase_id"
      t.string "number"
      t.string "name"
      t.timestamps
    end
  end
end
