import React, { useEffect } from "react";
import { Global } from "../../helpers/Global";

export const ListWeekSummary = ({ selectedUser ,weeks ,setWeeks }) => {


  useEffect(() => {
    if (selectedUser) {
      getWeeks(selectedUser._id);
    }
  }, [selectedUser]);

  const getWeeks = async (userId) => {
    try {
      const request = await fetch(`${Global.url}/week-summaries/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();
      if (data.status === "Success") {
        setWeeks(data.weeks);
      }
    } catch (error) {
      console.error("Error al obtener historial de semanas", error);
    }
  };

  if (!weeks.length) {
    return <p className="empty-text">No hay historial de semanas aún.</p>;
  }

  return (
    <div className="week-summary-list">
      {weeks.map((week) => (
        <div key={week._id} className="week-card">
          <h3 className="week-title">Semana</h3>
          <p  className="week-date"> {week.startDate} / {week.endDate}</p>
          <p className="week-total">Trabajado: {week.totalPercentage}%</p>
          <div className="week-daily">
            {week.dailyPercentages.map((day, index) => (
              <p key={index} className="week-day">
                {day.date}: {day.percentage}%
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};