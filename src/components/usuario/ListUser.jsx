import React, { useState } from "react";
import { UpdateUser } from "./UpdateUser";
import { Global } from "../../helpers/Global";

export const ListUser = ({ users, setUsers, onUserUpdated, onUserSelected }) => {
  const [editingUserId, setEditingUserId] = useState(null);

  const startEditing = (userId) => {
    setEditingUserId(userId);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (!confirmDelete) return;

    try {
      const request = await fetch(`${Global.url}/users/${userId}`, {
        method: "DELETE",
      });

      const data = await request.json();

      if (data.status === "Success") {
        // Actualiza la lista de usuarios
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userId)
        );
      } else {
        console.error("Error al eliminar usuario", data.message);
      }
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p className="empty-text">No hay usuarios registrados.</p>
      ) : (
        users.map((user) => (
          <div key={user._id}>
            {editingUserId === user._id ? (
              <UpdateUser
                user={user}
                onCancel={cancelEditing}
                onUserUpdated={onUserUpdated}
              />
            ) : (
              <div className="user-card">
                <h3 className="user-name">{user.name}</h3>
                <div className="user-actions">
                  <i onClick={() => onUserSelected(user)}  className="bx bxs-show btn-view"></i>
                  <i
                    onClick={() => startEditing(user._id)}
                    className="bx bx-pencil btn-edit"
                  ></i>
                  <i
                    onClick={() => deleteUser(user._id)}
                    className="bx bx-trash btn-delete"
                  ></i>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
