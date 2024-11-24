from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Required for session management

# Database configuration (replace with your actual MySQL credentials)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:123456@127.0.0.1/physio_activity'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable SQLAlchemy track modifications

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# User model for login functionality
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Store hashed password here
    role = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, username, password, role):
        self.username = username
        self.password = generate_password_hash(password)  # Hash the password before storing
        self.role = role

# Request model for physiotherapy requests
class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_name = db.Column(db.String(100), nullable=False)
    work_id = db.Column(db.String(50), nullable=False)
    preferred_date = db.Column(db.Date, nullable=False)
    preferred_time = db.Column(db.Time, nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'declined'), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, employee_name, work_id, preferred_date, preferred_time):
        self.employee_name = employee_name
        self.work_id = work_id
        self.preferred_date = preferred_date
        self.preferred_time = preferred_time

# Home page
@app.route('/')
def index():
    return render_template('index.html')

# Login route for authentication
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Check if the user exists in the database
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):  # Compare hashed password
            session['user_id'] = user.id
            session['role'] = user.role

            if user.role == 'employee':
                return redirect(url_for('employee_dashboard'))
            elif user.role == 'employer':
                return redirect(url_for('employer_dashboard'))
        else:
            return "Invalid username or password!", 400

    return render_template('login.html')

# Signup route for creating new users
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        role = request.form.get('role')

        # Check if the username already exists
        if User.query.filter_by(username=username).first():
            return "Username already exists!", 400

        # Hash the password before saving it to the database
        hashed_password = generate_password_hash(password)

        # Create a new user in the database
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()

        # Redirect based on user role
        if role == 'employee':
            return redirect(url_for('employee_dashboard'))
        elif role == 'employer':
            return redirect(url_for('employer_dashboard'))
        else:
            return "Invalid role selected!", 400

    return render_template('signup.html')

# Employee Dashboard
@app.route('/employee/dashboard')
def employee_dashboard():
    return "Employee Dashboard"

# Employer Dashboard
@app.route('/employer/dashboard')
def employer_dashboard():
    return "Employer Dashboard"

# Logout route to clear the session
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

# Route to view and create requests for employees
@app.route('/requests', methods=['GET', 'POST'])
def handle_requests():
    if request.method == 'POST':
        employee_name = request.form.get('employee_name')
        work_id = request.form.get('work_id')
        preferred_date = request.form.get('preferred_date')
        preferred_time = request.form.get('preferred_time')

        # Create a new request in the database
        new_request = Request(employee_name=employee_name, work_id=work_id, 
                              preferred_date=preferred_date, preferred_time=preferred_time)
        db.session.add(new_request)
        db.session.commit()

    # Fetch all requests (can be filtered later based on employee or employer)
    requests = Request.query.all()
    return render_template('requests.html', requests=requests)

# Route to update the status of a request (e.g., for an employer to accept/decline)
@app.route('/request/<int:request_id>/update', methods=['GET', 'POST'])
def update_request(request_id):
    request_obj = Request.query.get_or_404(request_id)
    if request.method == 'POST':
        new_status = request.form.get('status')
        request_obj.status = new_status
        db.session.commit()
        return redirect(url_for('handle_requests'))

    return render_template('update_request.html', request=request_obj)

# Initialize database tables (ensure they're created when app starts)
@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
