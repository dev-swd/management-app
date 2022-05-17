# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_05_05_124127) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "audits", force: :cascade do |t|
    t.bigint "project_id"
    t.string "kinds"
    t.integer "number"
    t.bigint "auditor_id"
    t.date "audit_date"
    t.string "title"
    t.text "contents"
    t.string "result"
    t.bigint "accept_id"
    t.date "accept_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_audits_on_project_id"
  end

  create_table "changelogs", force: :cascade do |t|
    t.bigint "project_id"
    t.integer "number"
    t.bigint "changer_id"
    t.date "change_date"
    t.text "contents"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_changelogs_on_project_id"
  end

  create_table "departments", force: :cascade do |t|
    t.string "code"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "divisions", force: :cascade do |t|
    t.bigint "department_id"
    t.string "code"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["department_id"], name: "index_divisions_on_department_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "number"
    t.string "name"
    t.string "name2"
    t.date "birthday"
    t.string "address"
    t.string "phone"
    t.date "joining_date"
    t.bigint "division_id"
    t.bigint "devise_id"
    t.string "authority"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "members", force: :cascade do |t|
    t.bigint "project_id"
    t.string "number"
    t.string "level"
    t.bigint "member_id"
    t.string "tag"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_members_on_project_id"
  end

  create_table "phases", force: :cascade do |t|
    t.bigint "project_id"
    t.string "number"
    t.string "name"
    t.date "planned_periodfr"
    t.date "planned_periodto"
    t.date "actual_periodfr"
    t.date "actual_periodto"
    t.text "deliverables"
    t.text "criteria"
    t.integer "review_count"
    t.bigint "planned_cost"
    t.decimal "planned_workload", precision: 5, scale: 2
    t.bigint "actual_cost"
    t.decimal "actual_workload", precision: 5, scale: 2
    t.string "ship_number"
    t.date "accept_comp_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_phases_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.string "status"
    t.string "approval"
    t.date "approval_date"
    t.bigint "pl_id"
    t.string "number"
    t.string "name"
    t.date "make_date"
    t.bigint "make_id"
    t.date "update_date"
    t.bigint "update_id"
    t.string "company_name"
    t.string "department_name"
    t.string "personincharge_name"
    t.string "phone"
    t.string "fax"
    t.string "email"
    t.date "development_period_fr"
    t.date "development_period_to"
    t.date "scheduled_to_be_completed"
    t.text "system_overview"
    t.text "development_environment"
    t.bigint "order_amount"
    t.bigint "planned_work_cost"
    t.decimal "planned_workload", precision: 5, scale: 2
    t.bigint "planned_purchasing_cost"
    t.bigint "planned_outsourcing_cost"
    t.decimal "planned_outsourcing_workload", precision: 5, scale: 2
    t.bigint "planned_expenses_cost"
    t.bigint "gross_profit"
    t.string "work_place_kbn"
    t.string "work_place"
    t.string "customer_property_kbn"
    t.string "customer_property"
    t.string "customer_environment"
    t.string "purchasing_goods_kbn"
    t.string "purchasing_goods"
    t.string "outsourcing_kbn"
    t.string "outsourcing"
    t.string "customer_requirement_kbn"
    t.string "customer_requirement"
    t.text "remarks"
    t.string "plan_approval"
    t.date "plan_approval_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "qualitygoals", force: :cascade do |t|
    t.bigint "project_id"
    t.string "number"
    t.text "contents"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_qualitygoals_on_project_id"
  end

  create_table "reports", force: :cascade do |t|
    t.bigint "project_id"
    t.string "approval"
    t.date "approval_date"
    t.date "make_date"
    t.bigint "make_id"
    t.date "delivery_date"
    t.bigint "actual_work_cost"
    t.decimal "actual_workload", precision: 5, scale: 2
    t.bigint "actual_purchasing_cost"
    t.bigint "actual_outsourcing_cost"
    t.decimal "actual_outsourcing_workload", precision: 5, scale: 2
    t.bigint "actual_expenses_cost"
    t.bigint "gross_profit"
    t.string "customer_property_accept_result"
    t.string "customer_property_accept_remarks"
    t.string "customer_property_used_result"
    t.string "customer_property_used_remarks"
    t.string "purchasing_goods_accept_result"
    t.string "purchasing_goods_accept_remarks"
    t.string "outsourcing_evaluate1"
    t.string "outsourcing_evaluate_remarks1"
    t.string "outsourcing_evaluate2"
    t.string "outsourcing_evaluate_remarks2"
    t.integer "communication_count"
    t.integer "meeting_count"
    t.integer "phone_count"
    t.integer "mail_count"
    t.integer "fax_count"
    t.integer "design_changes_count"
    t.integer "specification_change_count"
    t.integer "design_error_count"
    t.integer "others_count"
    t.integer "improvement_count"
    t.integer "corrective_action_count"
    t.integer "preventive_measures_count"
    t.integer "project_meeting_count"
    t.text "statistical_consideration"
    t.text "qualitygoals_evaluate"
    t.text "total_report"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_reports_on_project_id"
  end

  create_table "risks", force: :cascade do |t|
    t.bigint "project_id"
    t.string "number"
    t.text "contents"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_risks_on_project_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "nickname"
    t.string "image"
    t.string "email"
    t.json "tokens"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "audits", "projects"
  add_foreign_key "changelogs", "projects"
  add_foreign_key "divisions", "departments"
  add_foreign_key "members", "projects"
  add_foreign_key "phases", "projects"
  add_foreign_key "qualitygoals", "projects"
  add_foreign_key "reports", "projects"
  add_foreign_key "risks", "projects"
end
