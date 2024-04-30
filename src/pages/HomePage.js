// HomePage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../config";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [editTaskData, setEditTaskData] = useState({});
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when the component mounts
    checkAuthStatus();
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // get cookie value
      const authToken = getCookie("authToken");
      if (authToken) {
        setLoggedIn(true);
        setShowAlert(true);
        setAlertData({
          title: "Success!",
          message: "Login successfully.",
          type: "success",
        });
        dismissAlert();
      } else {
        setLoggedIn(false);
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };

  const dismissAlert = () => {
    setTimeout(() => {
      setShowAlert(false);
      setAlertData({ title: "", message: "", type: "" });
    }, 3000);
  };

  const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  const fetchTasks = async () => {
    try {
      const authToken = getCookie("authToken");
      console.log("Token is ", authToken);
      // Fetch tasks from backend
      const response = await axios.get(`${baseUrl}/api/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Fetched task ", response.data);
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setShowAlert(true);
      setAlertData({
        title: "Token expired!",
        message: "Please logout and login again.",
        type: "danger",
      });
    }
  };

  const addTask = async () => {
    try {
      const authToken = getCookie("authToken");
      console.log("Token is ", authToken);
      // Send request to backend to add new task
      const response = await axios.post(
        `${baseUrl}/api/tasks`,
        {
          description: newTask,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Res of add task ", response.data);

      if (response.data.success) {
        setShowAlert(true);
        setAlertData({
          title: "Success!",
          message: "Add task successfully.",
          type: "success",
        });
        // Refresh tasks list
        fetchTasks();
        setNewTask("");
        dismissAlert();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const authToken = getCookie("authToken");
    console.log("Token is ", authToken);
    try {
      // Send request to backend to delete task
      const response = await axios.delete(`${baseUrl}/api/tasks/${taskId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        setShowAlert(true);
        setAlertData({
          title: "Success!",
          message: "Delete task successfully.",
          type: "success",
        });
        // Refresh tasks list
        fetchTasks();
        dismissAlert();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async () => {
    console.log("Edit task is ", editTaskData);
    const authToken = getCookie("authToken");
    console.log("Token is ", authToken);
    try {
      // Send request to backend to delete task
      const response = await axios.put(
        `${baseUrl}/api/tasks/${editTaskData._id}`,
        {
          description: editTaskData.description,
          status: editTaskData.status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data.success) {
        const editModal = document.getElementById("close-modal");
        editModal.click();
        setShowAlert(true);
        setAlertData({
          title: "Success!",
          message: "Edit task successfully.",
          type: "success",
        });
        // Refresh tasks list
        fetchTasks();
        dismissAlert();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const delete_cookie = (name) => {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };

  const handleLogout = () => {
    delete_cookie("authToken");
    navigate("/login");
  };

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
        <div className="container-fluid flex justify-content-lg-between">
          <a className="navbar-brand text-light" href="#">
            Todo List
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <button
            className="btn btn-light mb-2 mb-lg-0 text-primary"
            onClick={handleLogout}
          >
            {"logout"}
          </button>
        </div>
      </nav>
      {showAlert && (
        <div
          className={`alert alert-${alertData.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{alertData.title}</strong> {alertData.message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="container mt-5">
        <h1 className="text-center">Task Management</h1>
        <div>
          <div className="mb-3">
            <label htmlFor="addtask" className="form-label">
              Add Description
            </label>
            <textarea
              className="form-control"
              id="addtask"
              rows="3"
              placeholder="describe a small note on task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            ></textarea>
          </div>
          <button onClick={addTask} className="btn btn-primary">
            Add Task
          </button>
        </div>
        <ul className="list-group mt-5">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item">
              {task.description}
              <h5 className="d-inline">
                <span className="mx-3 badge text-bg-secondary">
                  {" "}
                  {task.status}
                </span>
              </h5>
              <div className="float-end">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  onClick={() => setEditTaskData(task)}
                  className="btn btn-outline-primary mx-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="btn btn-outline-danger"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">
                Edit task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                id="addtask"
                rows="3"
                placeholder="describe a small note on task"
                value={editTaskData.description}
                onChange={(e) =>
                  setEditTaskData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>
              <select className="dropdown bg-secondary text-light px-3 py-1 rounded mt-3" value={editTaskData.status} onChange={(e)=> setEditTaskData((prev)=> ({ ...prev, 'status': e.target.value}))}>
                  <option className="dropdown-item text-light" value='Pendding'> {"Pendding"} </option>
                  <option className="dropdown-item text-light" value='In progress'> {"In progress"} </option>
                  <option className="dropdown-item text-light" value='Testing'> {"Testing"} </option>
                  <option className="dropdown-item text-light" value='Completed'> {"Completed"} </option>
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                id="close-modal"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={editTask}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
