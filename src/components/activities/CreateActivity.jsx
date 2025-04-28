import React, { useState } from "react";
import { Global } from "../../helpers/Global";

export const CreateActivity = ({ selectedUser, getActivities }) => {
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    try {
      const request = await fetch(`${Global.url}/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          percentage: percentage || 0,
          userId: selectedUser._id,
          date: formattedDate,
        }),
      });
      const data = await request.json();

      if (data.status === "Success") {
        setDescription("");
        setPercentage("");
        if (getActivities) {
          getActivities(selectedUser._id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-activity">
      <input
        type="text"
        placeholder="Ingrese la Actividad"
        className="input-text-a"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="% Trabajado"
        className="input-text-p"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Registrar Actividad
      </button>
    </form>
  );
};
