import "./home.css";
import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { ListUser } from "../../components/usuario/ListUser";
import { CreateUser } from "../../components/usuario/CreateUser";
import { CreateActivity } from "../../components/activities/CreateActivity";
import { ListActivity } from "../../components/activities/ListActivity";
import { HistoryWeeks } from "../../components/weekSummary/HistoryWeeks";
import { ListWeekSummary } from "../../components/WeekSummary/ListWeekSummary";
import { CreateWeekSummary } from "../../components/weekSummary/CreateWeekSummary";

export const Home = () => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // 👈 Mostrar u ocultar historial
  useEffect(() => {
    getUser();
    getActivities();
  }, []);

  const getUser = async () => {
    try {
      const request = await fetch(`${Global.url}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await request.json();
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };
  const getActivities = async (userId) => {
    try {
      const request = await fetch(`${Global.url}/activities/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await request.json();
      // 🔥 Ordenar primero las fechas más nuevas
      const sortedActivities = data.activities.sort((a, b) => {
        // Convertir las fechas (que son tipo string) a Date para comparar bien
        const dateA = new Date(a.date.split("-").reverse().join("-")); // 27-04-2025 => 2025-04-27
        const dateB = new Date(b.date.split("-").reverse().join("-"));
        return dateB - dateA; // 🔥 b primero, a después
      });

      setActivities(sortedActivities);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUserSelected = (user) => {
    setSelectedUser(user);
    getActivities(user._id);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
  };

  // Función para obtener semanas
  const getWeeks = async (userId) => {
    try {
      const request = await fetch(
        `${Global.url}/week-summaries/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await request.json();
      setWeeks(data.weeks);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Gestión de Usuarios y Actividades</h1>

      <div className="home-sections">
        {/* Sección de Usuarios */}
        <div className="section-card-user">
          <div className="section-user">
            <h2 className="section-title">Usuarios</h2>
          </div>

          <div className="section-component">
            <CreateUser onUserCreated={getUser} />
            <ListUser
              users={users}
              setUsers={setUsers}
              onUserUpdated={handleUserUpdated}
              onUserSelected={handleUserSelected}
            />
          </div>
        </div>

        {/* Sección de Actividades */}
        {selectedUser && (
          <div className="section-card-activity">
            <div className="section-container">
              <div className="section-user">
                <h2 className="section-title">Actividades de </h2>
                {selectedUser && (
                  <p className="selected-user-text">{selectedUser.name}</p>
                )}
              </div>

              <button
                className="btn-history-week"
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? "Ver Actividades" : "Ver Historial"}
              </button>
            </div>

            {!showHistory ? (
              <>
                <CreateActivity
                  selectedUser={selectedUser}
                  getActivities={getActivities}
                />

                <ListActivity
                  activities={activities}
                  setActivities={setActivities}
                  selectedUser={selectedUser}
                  getActivities={getActivities}
                />
              </>
            ) : (
              <>
                <CreateWeekSummary
                  selectedUser={selectedUser}
                  activities={activities}
                  clearActivities={() => setActivities([])}
                  refreshWeeks={() => getWeeks(selectedUser._id)}
                  weeks={weeks}
                />
                <ListWeekSummary
                  selectedUser={selectedUser}
                  weeks={weeks}
                  setWeeks={setWeeks}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
