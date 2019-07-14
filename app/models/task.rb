class Task < ApplicationRecord
  scope :most_recent, -> { order(order: :asc) }
end
