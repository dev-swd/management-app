class Employee < ApplicationRecord
  has_many :approvalauths, dependent: :destroy
  belongs_to :division
end
