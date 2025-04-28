import React from "react";
import { Global } from "../../helpers/Global";

export const CreateWeekSummary =  ({ selectedUser, activities, clearActivities, refreshWeeks, weeks }) => {

    const handleCloseWeek = async () => {
      // 1. Verificar si hay usuario y actividades
      if (!selectedUser) {
        alert("Selecciona un usuario primero.");
        return;
      }
  
      if (activities.length === 0) {
        alert("No hay actividades para cerrar la semana.");
        return;
      }
  
      const confirmClose = window.confirm("¿Seguro que quieres cerrar esta semana?");
      if (!confirmClose) return;
  
      try {
        // 🔥 2. Obtener todas las fechas que ya están en semanas cerradas
        const existingDates = weeks.flatMap((week) =>
          week.dailyPercentages.map((day) => day.date)
        );
  
        // 🔥 3. Filtrar solo actividades NUEVAS
        const newActivities = activities.filter(
          (activity) => !existingDates.includes(activity.date)
        );
  
        if (newActivities.length === 0) {
          alert("No hay nuevas actividades para cerrar esta semana.");
          return;
        }
  
        // 🔥 4. Calcular porcentaje promedio
        const totalSum = newActivities.reduce((sum, act) => sum + (parseFloat(act.percentage) || 0), 0);
        const averagePercentage = Math.round(totalSum / newActivities.length);
  
        // 🔥 5. Fechas inicio y fin
        const sortedDates = newActivities.map(act => act.date).sort();
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];
  
        // 🔥 6. Formato diario
        const dailyPercentages = newActivities.map(act => ({
          date: act.date,
          percentage: act.percentage,
        }));
  
        const weekData = {
          user: selectedUser._id,
          startDate,
          endDate,
          totalPercentage: averagePercentage,
          dailyPercentages,
        };
  
        // 🔥 7. Enviar al backend
        const response = await fetch(`${Global.url}/week-summaries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(weekData),
        });
  
        const data = await response.json();
  
        if (data.status === "Success") {
          alert("¡Semana cerrada exitosamente!");
          clearActivities();  // 🔥 Limpiar actividades para comenzar nueva semana
          if (refreshWeeks) refreshWeeks(); // 🔥 Actualizar historial
        } else {
          console.error("Error al cerrar semana", data.msg);
        }
  
      } catch (error) {
        console.error("Error al cerrar semana", error);
      }
    };
  
    return (
      <div className="week-summary-container">
        <button className="btn-primary" onClick={handleCloseWeek}>
          Cerrar Semana
        </button>
      </div>
    );
  };