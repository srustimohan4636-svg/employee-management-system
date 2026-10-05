import { useEffect, useState } from "react";
import "./index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
const API_URL = `${API_BASE.replace(/\/+$/, "")}/api/employees`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("adminLoggedIn") === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
  });

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError("Unable to connect to backend");
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchEmployees();
    }
  }, [isLoggedIn]);

  // ---------------- LOGIN ----------------

  const handleLogin = (e) => {
    e.preventDefault();

    setLoginError("");

    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("adminLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  // ---------------- EMPLOYEE FORM ----------------

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.name ||
      !form.email ||
      !form.department ||
      !form.designation
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setForm({
        name: "",
        email: "",
        department: "",
        designation: "",
      });

      setEditingId(null);

      setMessage(
        editingId
          ? "Employee updated successfully!"
          : "Employee added successfully!"
      );

      fetchEmployees();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setMessage("Employee deleted successfully!");

      fetchEmployees();

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      department: "",
      designation: "",
    });

    setError("");
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText) ||
      employee.designation.toLowerCase().includes(searchText);

    const matchesDepartment =
      department === "" ||
      employee.department === department;

    return matchesSearch && matchesDepartment;
  });

  const departments = [
    ...new Set(
      employees.map((employee) => employee.department)
    ),
  ];
  const departmentData = departments.map((dept) => ({
  department: dept,
  employees: employees.filter(
    (employee) => employee.department === dept
  ).length,
}));

  // ---------------- LOGIN PAGE ----------------

  if (!isLoggedIn) {
    return (
      <div className="login-page">

        <div className="login-card">

          <div className="login-icon">
            👤
          </div>

          <h1>Admin Login</h1>

          <p className="login-subtitle">
            Employee Management System
          </p>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button type="submit">
              Login
            </button>

          </form>

          {loginError && (
            <p className="login-error">
              {loginError}
            </p>
          )}

          <div className="demo-login">
            <strong>Demo Login</strong>
            <p>Username: admin</p>
            <p>Password: admin123</p>
          </div>

        </div>

      </div>
    );
  }

  // ---------------- DASHBOARD ----------------

  return (
    <div className="container">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Employee Management
        </div>

        <div className="nav-right">

          <span>
            Admin
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage employees efficiently
          </p>
        </div>

      </div>

      {/* DASHBOARD CARDS */}

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Employees</h3>
          <p>{employees.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Departments</h3>
          <p>{departments.length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Employees</h3>
          <p>{employees.length}</p>
        </div>

      </div>

      {/* DEPARTMENT CHART */}
      {departmentData.length > 0 && (
        <div className="card chart-card">
          <h2>Department Overview</h2>
          <div style={{ width: "100%", height: 280, marginTop: "15px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="employees" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ADD / UPDATE */}

      <div className="card">

        <h2>
          {editingId
            ? "Update Employee"
            : "Add New Employee"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId
              ? "Update Employee"
              : "Add Employee"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          )}

        </form>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {message && (
          <p className="success">
            {message}
          </p>
        )}

      </div>

      {/* EMPLOYEE LIST */}

      <div className="card">

        <h2>
          Employee List
        </h2>

        <p className="employee-subtitle">
          View and manage all employees
        </p>

        <div className="filters">

          <input
            type="text"
            placeholder="🔍 Search employees..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          >

            <option value="">
              All Departments
            </option>

            {departments.map((dept) => (
              <option
                key={dept}
                value={dept}
              >
                {dept}
              </option>
            ))}

          </select>

        </div>

        {filteredEmployees.length === 0 ? (

          <p className="no-data">
            No employees found.
          </p>

        ) : (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredEmployees.map(
                  (employee) => (

                    <tr key={employee.id}>

                      <td>
                        #{employee.id}
                      </td>

                      <td>
                        <strong>
                          {employee.name}
                        </strong>
                      </td>

                      <td>
                        {employee.email}
                      </td>

                      <td>
                        <span className="department-badge">
                          {employee.department}
                        </span>
                      </td>

                      <td>
                        {employee.designation}
                      </td>

                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedEmployee(
                              employee
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(employee)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              employee.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* EMPLOYEE DETAILS */}

      {selectedEmployee && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>
              Employee Details
            </h2>

            <div className="employee-details">

              <p>
                <strong>ID:</strong>{" "}
                #{selectedEmployee.id}
              </p>

              <p>
                <strong>Name:</strong>{" "}
                {selectedEmployee.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {selectedEmployee.email}
              </p>

              <p>
                <strong>Department:</strong>{" "}
                {selectedEmployee.department}
              </p>

              <p>
                <strong>Designation:</strong>{" "}
                {selectedEmployee.designation}
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedEmployee(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;