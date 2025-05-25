// src/services/calendarSlotsService.ts
import apiSec from "../utils/tokenapi.utils";

export interface CalendarSlot {
  id: number;
  userId: number;
  calendarType: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  description: string;
  startWeek: number;
  startYear: number;
  weeksToCopy: number;
}

export const getCalendarSlots = async (
  userId: number,
  calendarType: string
): Promise<CalendarSlot[]> => {
  try {
    const { data } = await apiSec.get("/calendar-slots", {
      params: {
        userId: userId.toString(),
        calendarType
      }
    });
    return data;
  } catch (err) {
    console.error("Erreur getCalendarSlots :", err);
    throw err;
  }
};

export const deleteAllCalendarSlots = async (
  userId: number,
  calendarType: string
): Promise<void> => {
  await apiSec.delete(`/calendar-slots/all/${userId}`, {
    params: { calendarType }
  });
};

export const deleteCalendarSlot = async (id: number): Promise<void> => {
  await apiSec.delete(`/calendar-slots/${id}`);
};

export const createCalendarSlot = async (payload: any): Promise<any> => {
  const { data } = await apiSec.post("/calendar-slots", payload);
  return data;
};

export const updateCalendarSlot = async (
  id: number,
  updates: Partial<CalendarSlot>
): Promise<void> => {
  await apiSec.put(`/calendar-slots/${id}`, updates);
};
