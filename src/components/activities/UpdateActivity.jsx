import React, { useState } from "react";
import { Global } from "../../helpers/Global";

export const UpdateActivity = ({ activity, onCancel, getActivities, selectedUser }) => {
  const [editedDescription, setEditedDescription] = useState(activity.description);
  const [editedPercentage, setEditedPercentage] = useState(activity.percentage);

  const handleUpdate = async () => {
    try {
      const request = await fetch(`${Global.url}/activities/${activity._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: editedDescription,
          percentage: editedPercentage,
        }),
      });

      const data = await request.json();

      if (data.status === "Success") {
        getActivities(selectedUser._id); // << Refrescamos lista de actividades
        onCancel(); // << Cerramos modo edición
      } else {
        console.error("Error al actualizar actividad", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar actividad", error);
    }
  };

  return (
    <div className="activity-card">
      <div className="activity-update">
        <textarea
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="input-textarea-setDes"
        />
        <input
          type="number"
          value={editedPercentage}
          onChange={(e) => setEditedPercentage(e.target.value)}
          className="input-text-setPer"
        />
      </div>
      <div className="user-actions">
        <i onClick={handleUpdate} className="bx bx-save btn-save"></i>
        <i onClick={onCancel} className="bx bx-x btn-cancel"></i>
      </div>
    </div>
  );
};