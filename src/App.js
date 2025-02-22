import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users") || "[]")
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    stream: "",
    age: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === "age" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, stream, age } = formData;

    if (!name || !email || !stream || !age) {
      alert("All fields are required!");
      return;
    }

    if (editId !== null) {
      setUsers(
        users.map((user) =>
          user.id === editId ? { ...user, name, email, stream, age: Number(age) } : user
        )
      );
      setEditId(null);
    } else {
      setUsers([...users, { id: Date.now(), name, email, stream, age: Number(age) }]);
    }

    setFormData({ name: "", email: "", stream: "", age: "" });
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setFormData({ ...userToEdit, age: String(userToEdit.age) });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="container">
      <h2>User Form</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="stream" placeholder="Stream" value={formData.stream} onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <button type="submit">{editId !== null ? "Update" : "Submit"}</button>
      </form>

      <h2>User List</h2>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Stream</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.stream}</td>
                <td>{user.age}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
};

export default App;
