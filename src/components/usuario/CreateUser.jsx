import React, { useState } from "react";
import { Global } from "../../helpers/Global";

export const CreateUser = ({ onUserCreated }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await fetch(`${Global.url}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await request.json();

      if (data.status === "Success") {
        setName("");
        if (onUserCreated) {
          onUserCreated();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-user">
      <input
        type="text"
        placeholder="Ingrese el Nombre"
        className="input-text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary">
        Registrar
      </button>
    </form>
  );
};
