import React from 'react'

export const HistoryWeeks =({ weeklySummaries }) => {
    return (
      <div className="history-container">
        {weeklySummaries.length === 0 ? (
          <p className="empty-text">No hay semanas cerradas aún.</p>
        ) : (
          weeklySummaries.map((week, index) => (
            <div key={index} className="week-summary">
              <h3>Semana: {week.startDate} / {week.endDate}</h3>
              <p>Trabajado: {week.totalPercentage}%</p>
              {week.dailyPercentages.map((day, idx) => (
                <p key={idx}>{day.date}: {day.percentage}%</p>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };