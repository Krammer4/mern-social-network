import React, { useEffect, useState } from "react";
import "./NotesPage.css";
import { backend_url } from "../../consts";
import { useHttp } from "../../hooks/httpHook";

import cross from "../../img/Notes/cross.png";

export const NotesPage = () => {
  const userStorageData = JSON.parse(localStorage.getItem("userData"));

  const { request, loading } = useHttp();
  const [userData, setUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const deleteNote = async (note) => {
    const deletingData = await request(
      `${backend_url}/api/delete-note?userId=${userStorageData.userId}&note=${note}`,
      "DELETE"
    );
    fetchUserData();
    showSuccessMessage(deletingData);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setIsSuccessMessageVisible(true);
    setTimeout(() => {
      setIsSuccessMessageVisible(false);
      setSuccessMessage("");
    }, 3000);
  };

  const fetchUserData = async () => {
    const userData = await request(
      `${backend_url}/api/user/${userStorageData.userId}`,
      "GET"
    );
    setUserData(userData);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="notes">
      <div className="notes _container">
        <div className="notes-content">
          <h1 className="notes-mainTitle">Уведомления</h1>
          <div className="notes-allNotes">
            {userData &&
              userData.notes.length !== 0 &&
              userData.notes.reverse().map((note) => {
                return (
                  <div className="note">
                    <div className="note-container">
                      <div className="note-row">
                        <p className="note-text">{note}</p>
                        <img
                          onClick={() => deleteNote(note)}
                          src={cross}
                          className="note-cross"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
