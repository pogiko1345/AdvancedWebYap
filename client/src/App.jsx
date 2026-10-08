import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "Localhost";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEdit = (id) => {
    const student = students.find((s) => s._id === id);

    if (student) {
      setName(student.name);
      setCourse(student.course);
      setAge(student.age);
      setEditingId(id);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const response = await axios.put(`${API_URL}/${editingId}`, {
          name,
          course,
          age,
        });

        setStudents(
          students.map((student) =>
            student._id === editingId ? response.data : student,
          ),
        );

        setEditingId(null);
      } else {
        const response = await axios.post(API_URL, {
          name,
          course,
          age,
        });

        setStudents([...students, response.data]);
      }

      setName("");
      setCourse("");
      setAge("");
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="App">
      <h1>Student Management System</h1>

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Course"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        {editingId ? "Update Student" : "Add Student"}
      </button>

      <hr />

      <h2>Students</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div key={student._id}>
            <p>
              <strong>Name:</strong> {student.name}
            </p>
            <p>
              <strong>Course:</strong> {student.course}
            </p>
            <p>
              <strong>Age:</strong> {student.age}
            </p>

            <button onClick={() => handleEdit(student._id)}>Edit</button>

            <button onClick={() => handleDelete(student._id)}>Delete</button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}
