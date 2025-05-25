// src/components/calendar/WeekSchedule.tsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import apiSec from "../../utils/tokenapi.utils";

const localizer = momentLocalizer(moment);

interface WeekScheduleProps {
  selectedProfileId: number;
  calendarType: string;
  readOnly?: boolean;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ selectedProfileId, calendarType, readOnly = false }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState<"delete" | "edit" | null>(null);
  const [editMode, setEditMode] = useState<"slot" | "series" | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [weeksToCopy, setWeeksToCopy] = useState(0);

  const fetchCalendarSlots = async () => {
    try {
      const { data } = await apiSec.get(`/calendar-slots`, {
        params: { userId: selectedProfileId.toString(), calendarType }
      });

      const mapped = data.flatMap((slot) => {
        const start = moment().year(slot.startYear).week(slot.startWeek).day(slot.dayOfWeek).set({
          hour: moment(slot.startTime, "HH:mm:ss").hour(),
          minute: moment(slot.startTime, "HH:mm:ss").minute()
        });
        const end = moment(start).set({
          hour: moment(slot.endTime, "HH:mm:ss").hour(),
          minute: moment(slot.endTime, "HH:mm:ss").minute()
        });

        return Array.from({ length: slot.weeksToCopy + 1 }).map((_, i) => ({
          id: slot.id + "_" + i,
          baseId: slot.id,
          title: slot.description || "Disponible",
          start: start.clone().add(i, "weeks").toDate(),
          end: end.clone().add(i, "weeks").toDate(),
          startWeek: slot.startWeek,
          startYear: slot.startYear,
          weeksToCopy: slot.weeksToCopy
        }));
      });
      setEvents(mapped);
    } catch (err) {
      console.error("Erreur lors du chargement des créneaux:", err);
    }
  };

  const addSlot = async (slot) => {
    try {
      const startWeek = moment(slot.start).week();
      const startYear = moment(slot.start).year();
      await apiSec.post(`/calendar-slots`, {
        userId: selectedProfileId,
        calendarType,
        dayOfWeek: moment(slot.start).format("dddd"),
        startTime: moment(slot.start).format("HH:mm:ss"),
        endTime: moment(slot.end).format("HH:mm:ss"),
        description: slot.title || "Disponible",
        startWeek,
        startYear,
        weeksToCopy : slot.weeksToCopy //
      });
      fetchCalendarSlots();
    } catch (err) {
      console.error("Erreur ajout créneau:", err);
    }
  };

  const deleteSlot = async (baseId: number, index: number) => {
    try {
      const slot = events.find(e => e.id === baseId + "_" + index);
      if (!slot) return;
      const middleWeek = moment(slot.start).week();
      const originalEnd = slot.startWeek + slot.weeksToCopy;

      if (editMode === "series") {
        await apiSec.delete(`calendar-slots/${baseId}`);
      } else if (editMode === "slot") {
        console.log("→ Suppression d'un créneau unique", slot.startWeek, middleWeek, originalEnd);
        if (middleWeek === slot.startWeek) {
          const newStart = moment(slot.start).add( 1, "weeks").toDate();
          const newEnd = moment(slot.end).add(1, "weeks").toDate();
          const remainingWeeks = slot.weeksToCopy - 1;
          await apiSec.delete(`calendar-slots/${baseId}`);
          await addSlot({ start: newStart, end: newEnd, title: slot.title, weeksToCopy: remainingWeeks });
        } else if (middleWeek < originalEnd) {
          const remainingStart = moment(slot.start).add( 1, "weeks").toDate();
          const remainingEnd = moment(slot.end).add( 1, "weeks").toDate();
          const remainingWeeksToCopy = originalEnd - middleWeek - 1;
          await apiSec.put(`/calendar-slots/${baseId}`, {
            weeksToCopy: middleWeek - slot.startWeek - 1

          });
          await addSlot({ start: remainingStart, end: remainingEnd, title: slot.title, weeksToCopy: remainingWeeksToCopy });
        } else {
          await apiSec.put(`/calendar-slots/${baseId}`, {
            weeksToCopy: middleWeek - slot.startWeek - 1
          });
        }
      }
      fetchCalendarSlots();
    } catch (err) {
      console.error("Erreur suppression créneau:", err);
    }
  };

  const deleteAllSlots = async () => {
    if (!window.confirm("Tout effacer ?")) return;
    try {
      await apiSec.delete(`calendar-slots/all/${selectedProfileId}`, { params: { calendarType } });
      setEvents([]);
    } catch (err) {
      console.error("Erreur suppression tous créneaux:", err);
    }
  };

  useEffect(() => {
    if (selectedProfileId) fetchCalendarSlots();
    else setEvents([]);
  }, [selectedProfileId, calendarType]);

  const handleSlotSelection = ({ start, end }) => {
    addSlot({ start, end, title: "Disponible", weeksToCopy: 0 });
  };

  const handleDoubleClick = (slot) => {
    const [baseId, index] = slot.id.split("_").map((v, i) => i === 1 ? parseInt(v) : v);
    setSelectedSlot({ ...slot, baseId, index });
    setNewTitle(slot.title || "");
    setWeeksToCopy(slot.weeksToCopy || 0);
    setActionType("edit");
    setEditMode(slot.weeksToCopy > 0 ? null : "slot");
    setModalVisible(true);
    setSelectedSlot({ ...slot, baseId, index });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Delete" && selectedSlot) {
      const [baseId, index] = selectedSlot.id.split("_").map((v, i) => i === 1 ? parseInt(v) : v);
      setSelectedSlot({ ...selectedSlot, baseId, index }); // injecter les deux
      setActionType("delete");
      setEditMode(selectedSlot.weeksToCopy > 0 ? null : "slot");
      setModalVisible(true);
    }
  };

  const applyChanges = async () => {
    console.log("ApplyChanges called with:", { selectedSlot, actionType, editMode });
    if (!selectedSlot || !editMode) {
      console.warn("Aucune action possible : slot ou mode non défini.");
      return;
    }
    const { baseId, index } = selectedSlot;
    if (actionType === "delete") await deleteSlot(baseId, index);
    if (actionType === "edit") {
      await apiSec.put(`/calendar-slots/${baseId}`, { description: newTitle, weeksToCopy });
      fetchCalendarSlots();
    }
    setModalVisible(false);
  };

  return (
    <section tabIndex={0} onKeyDown={handleKeyDown} className="relative">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.WEEK}
        views={{ week: true }}
        step={60}
        timeslots={1}
        style={{ height: "auto" }}
        selectable={!readOnly}
        onSelectSlot={!readOnly ? handleSlotSelection : undefined}
        onDoubleClickEvent={!readOnly ? handleDoubleClick : undefined}
        onSelectEvent={!readOnly ? setSelectedSlot : undefined}
        min={new Date(2024, 11, 8, 6, 0)}
        max={new Date(2024, 11, 8, 22, 0)}
      />
      {!readOnly && (
        <div className="flex justify-center mt-4">
          <button onClick={deleteAllSlots} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Tout effacer
          </button>
        </div>
      )}
      {!readOnly && modalVisible && selectedSlot && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            {editMode === null ? (
              <>
                <h2 className="text-lg font-bold mb-4">
                  {actionType === "delete" ? "Supprimer la série ou ce créneau ?" : "Modifier la série ou ce créneau ?"}
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Choisir une option :</label>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2" onClick={() => setEditMode("series")}>Série entière</button>
                  <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" onClick={() => setEditMode("slot")}>Ce créneau uniquement</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">{actionType === "delete" ? "Confirmer la suppression" : "Modifier"}</h2>
                {actionType === "edit" && (
                  <>
                    <textarea value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="border px-2 py-1 w-full h-24 mb-4 resize-none" />
                    <label htmlFor="weeksToCopy" className="block text-sm font-medium text-gray-700">Nombre de semaines à recopier :</label>
                    <input id="weeksToCopy" type="number" min="0" value={weeksToCopy} onChange={(e) => setWeeksToCopy(Number(e.target.value))} className="border px-2 py-1 w-full mb-4" />
                  </>
                )}
                {actionType === "delete" && <p className="mb-4">{editMode === "series" ? "Vous êtes sur le point de supprimer toute la série." : "Vous êtes sur le point de supprimer ce créneau uniquement."}</p>}
                <button onClick={applyChanges} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Valider</button>
                <button onClick={() => { setWeeksToCopy(0); setNewTitle(selectedSlot.title || ""); setModalVisible(false); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WeekSchedule;
