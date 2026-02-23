export type Reservation = {
  id: string
  student_name: string
  grade: string
  school: string | null
  parent_phone: string
  parent_name: string | null
  current_math_level: string | null
  recent_exam_score: string | null
  exam_target: string | null
  reservation_type: string
  desired_date: string
  desired_time_slot: string
  status: string
  admin_memo: string | null
  created_at: string
  updated_at: string
}

export type ReservationInsert = Omit<Reservation, 'id' | 'status' | 'admin_memo' | 'created_at' | 'updated_at'>
