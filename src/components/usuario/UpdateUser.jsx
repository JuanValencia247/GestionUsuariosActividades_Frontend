import React, { useState } from "react";
import { Global } from "../../helpers/Global";

export const UpdateUser = ({ user, onCancel, onUserUpdated }) => {
  const [newName, setNewName] = useState(user.name);

  const handleUpdate = async () => {
    try {
      const request = await fetch(`${Global.url}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await request.json();

      if (data.status === "Success") {
        if (onUserUpdated) {
          onUserUpdated(data.user);
        }
        onCancel(); // Salir del modo edición
      } else {
        console.error("Error al actualizar usuario", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar usuario", error);
    }
  };

  return (
    <div className="user-card">
      <input
        type="text"
        className="input-text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <div className="user-actions">
        <i onClick={handleUpdate} className="bx bx-save btn-save"></i>
        <i onClick={onCancel} className="bx bx-x btn-cancel"></i>
      </div>
    </div>
  );
};
