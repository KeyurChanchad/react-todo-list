// HomePage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "../config";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch tasks when the component mounts
    fetchTasks();
  }, []);

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
        // Refresh tasks list
        fetchTasks();
        setNewTask("");
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
        // Refresh tasks list
        fetchTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const delete_cookie = (name)=> {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const handleLogout = ()=> {
    delete_cookie('authToken');
    navigate('/login');
  }

  return (
    <React.Fragment>
    <nav className="navbar navbar-expand-lg navbar-primary bg-primary">
        <div className="container-fluid flex justify-content-lg-between">
          <a className="navbar-brand text-light" href="#">Todo List</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <button className="btn btn-light mb-2 mb-lg-0 text-primary" onClick={handleLogout}>{'logout'}</button>
        </div>
      </nav>
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
          <button onClick={addTask} className="btn btn-primary">Add Task</button>
        </div>
        <ul className="list-group mt-5">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item">
              {task.description}
              <button onClick={() => deleteTask(task._id)} className="btn btn-danger float-end">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
