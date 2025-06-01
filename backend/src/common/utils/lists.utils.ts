export const roleList = [
  'student',
  'parent',
  'teacher',
  'pedagogical_animator',
  'pedagogical_manager',
  'it_admin',
  'financial_admin',
  'superadmin'
 ] as const;

export type RoleList = typeof roleList[number];

export const relationList = [
    'impossible',
    '*',
    'all',
    'is_parent_of',
    'is_child_of',
    'is_animator_of',
    'is_animated_by',
    'is_teacher_of',
    'is_pupil_of',
    'is_manager_of',
    'is_managed_by',
] as const;

export type RelationList = typeof relationList[number];

export const relationState = [
    'requested',
    'requestedBack',
    'current',
    'past',
    'wrong',
] as const;

export type RelationState = typeof relationState[number];

export const notificationType = [
    'message',
    'client_creation',
    'user_managed',
    'relation_request',
    'relation_creation',
    'teacher_request',
] as const;

export type NotificationType = typeof notificationType[number];

export const actionMode = [
    'mono',
    'multi',
    'total',
] as const;

export type actionMode = typeof actionMode[number];

export const calendarType = [
    'Availability',
    'Courses',
    'Global',
] as const;

export type CalendarType = typeof calendarType[number];

export const quizQuestionType = [
  'text',
  'multiple',
  'order',
] as const;

export type QuizQuestionType = typeof quizQuestionType[number];