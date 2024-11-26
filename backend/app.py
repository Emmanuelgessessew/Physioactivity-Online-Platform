from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Change to a strong key in production

# Database configuration for SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///physio_activity.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_name = db.Column(db.String(100), nullable=False)
    work_id = db.Column(db.String(50), nullable=False)
    preferred_date = db.Column(db.Date, nullable=False)
    preferred_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default='pending')

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']

        # Check if the username or email already exists
        existing_user = User.query.filter_by(username=username).first()
        existing_email = User.query.filter_by(email=email).first()

        if existing_user:
            flash("Username already exists. Please choose a different one.", 'error')
            return redirect(url_for('signup'))

        if existing_email:
            flash("Email already exists. Please use a different email address.", 'error')
            return redirect(url_for('signup'))

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Create new user
        new_user = User(username=username, email=email, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully! Please log in.", 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']

        # Retrieve user from the database
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            # Verify role match
            if user.role != role:
                flash("Role does not match the stored account information.", 'error')
                return redirect(url_for('login'))

            # Store user data in session
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role

            # Redirect based on role
            if user.role == "employee":
                return redirect(url_for('employee_dashboard'))
            elif user.role in ["hr", "therapist"]:
                return redirect(url_for('employer_dashboard'))
            else:
                flash("Invalid role selected.", 'error')
                return redirect(url_for('login'))
        else:
            flash("Invalid credentials or user not found.", 'error')
            return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/employee/dashboard')
def employee_dashboard():
    if session.get('role') != 'employee':
        return redirect(url_for('login'))
    return render_template('employee.html')

@app.route('/employer/dashboard')
def employer_dashboard():
    if session.get('role') not in ['hr', 'therapist']:
        return redirect(url_for('login'))
    requests = Request.query.all()
    return render_template('employer.html', requests=requests)

@app.route('/submit_request', methods=['POST'])
def submit_request():
    if request.method == 'POST':
        employee_name = request.form['name']
        work_id = request.form['workId']
        preferred_date = request.form['preferred_date']
        preferred_time = request.form['preferred_time']

        # Create new request for the employee
        new_request = Request(employee_name=employee_name, work_id=work_id,
                              preferred_date=preferred_date, preferred_time=preferred_time)
        db.session.add(new_request)
        db.session.commit()

        flash("Physiotherapy request submitted successfully.", 'success')
        return redirect(url_for('employee_dashboard'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Initialize database
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Creates the database tables if they do not exist
    app.run(debug=True)
