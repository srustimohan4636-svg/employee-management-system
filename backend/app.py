from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Database Configuration
# -----------------------------

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, "employees.db")
database_url = os.environ.get("DATABASE_URL", "sqlite:///" + DATABASE_PATH)
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# -----------------------------
# Employee Model
# -----------------------------

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    designation = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "designation": self.designation
        }


# -----------------------------
# Home / Test Route
# -----------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Employee Management API is running!"
    })


# -----------------------------
# GET ALL EMPLOYEES
# -----------------------------

@app.route("/api/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.all()

    return jsonify([
        employee.to_dict()
        for employee in employees
    ])


# -----------------------------
# GET ONE EMPLOYEE
# -----------------------------

@app.route("/api/employees/<int:id>", methods=["GET"])
def get_employee(id):
    employee = db.session.get(Employee, id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    return jsonify(employee.to_dict())


# -----------------------------
# ADD EMPLOYEE
# -----------------------------

@app.route("/api/employees", methods=["POST"])
def add_employee():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    name = data.get("name")
    email = data.get("email")
    department = data.get("department")
    designation = data.get("designation")

    if not name or not email or not department or not designation:
        return jsonify({
            "error": "All fields are required"
        }), 400

    employee = Employee(
        name=name,
        email=email,
        department=department,
        designation=designation
    )

    db.session.add(employee)
    db.session.commit()

    return jsonify({
        "message": "Employee added successfully",
        "employee": employee.to_dict()
    }), 201


# -----------------------------
# UPDATE EMPLOYEE
# -----------------------------

@app.route("/api/employees/<int:id>", methods=["PUT"])
def update_employee(id):

    employee = db.session.get(Employee, id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    employee.name = data.get("name", employee.name)
    employee.email = data.get("email", employee.email)
    employee.department = data.get(
        "department",
        employee.department
    )
    employee.designation = data.get(
        "designation",
        employee.designation
    )

    db.session.commit()

    return jsonify({
        "message": "Employee updated successfully",
        "employee": employee.to_dict()
    })


# -----------------------------
# DELETE EMPLOYEE
# -----------------------------

@app.route("/api/employees/<int:id>", methods=["DELETE"])
def delete_employee(id):

    employee = db.session.get(Employee, id)

    if not employee:
        return jsonify({
            "error": "Employee not found"
        }), 404

    db.session.delete(employee)
    db.session.commit()

    return jsonify({
        "message": "Employee deleted successfully"
    })


# -----------------------------
# CREATE DATABASE
# -----------------------------

with app.app_context():
    db.create_all()


# -----------------------------
# RUN APPLICATION
# -----------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "false").lower() in ("true", "1")
    app.run(host="0.0.0.0", port=port, debug=debug)