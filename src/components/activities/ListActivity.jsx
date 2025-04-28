import { useState } from "react";
import { Global } from "../../helpers/Global";
import { UpdateActivity } from "./UpdateActivity";

export const ListActivity = ({
  activities,
  setActivities,
  selectedUser,
  getActivities,
}) => {
  const [editingActivityId, setEditingActivityId] = useState(null);

  const startEditing = (activityId) => {
    setEditingActivityId(activityId);
  };

  const cancelEditing = () => {
    setEditingActivityId(null);
  };

  const deleteActivity = async (activityId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que quieres eliminar esta actividad?"
    );
    if (!confirmDelete) return;

    try {
      const request = await fetch(`${Global.url}/activities/${activityId}`, {
        method: "DELETE",
      });

      const data = await request.json();

      if (data.status === "Success") {
        setActivities((prevActivities) =>
          prevActivities.filter((activity) => activity._id !== activityId)
        );
      } else {
        console.error("Error al eliminar actividad", data.message);
      }
    } catch (error) {
      console.error("Error al eliminar actividad", error);
    }
  };

  return (
    <div className="activity-list">
      {activities.length === 0 ? (
        <p className="empty-text">No hay actividades registradas.</p>
      ) : (
        <>
          {activities.map((activity) => (
            <div key={activity._id}>
              {editingActivityId === activity._id ? (
                <UpdateActivity
                  activity={activity}
                  onCancel={cancelEditing}
                  getActivities={getActivities}
                  selectedUser={selectedUser}
                />
              ) : (
                <div className="activity-card">
                  <div>
                    <p className="activity-text-de">{activity.description}</p>
                    <p className="activity-text-p">{activity.percentage}%</p>
                    <p className="activity-text-da">{activity.date}</p>
                  </div>

                  <div className="user-actions">
                    <i
                      onClick={() => startEditing(activity._id)}
                      className="bx bx-pencil btn-edit"
                    ></i>
                    <i
                      onClick={() => deleteActivity(activity._id)}
                      className="bx bx-trash btn-delete"
                    ></i>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
