from flask import Flask, render_template, url_for, request, session, redirect
from flask_pymongo import PyMongo
import bcrypt

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'SampleProject'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/SampleProject'

from app import routes

mongo = PyMongo(app)

@app.route('/')
@app.route('/Landing')
def Landing():
	Customer = mongo.db.Customer
	query_0 = Customer.find_one({'Person_Name' : "Steve"})
	return render_template('Landing.html', title='Landing', query_0=query_0)

@app.route('/Home')
def Home():
	if not session.get('username'):
		return redirect(url_for('Login'))
	query_0 = session['first_name']
	Group = mongo.db.Group
	multiquery_29 = Group.find({'primary_key': "userId"})
	Bill = mongo.db.Bill
	multiquery_30 = Bill.find({'amount': "userId"})
	Bill = mongo.db.Bill
	multiquery_31 = Bill.find({'amount': "userId"})
	return render_template('Home.html', title='Home', query_0=query_0, multiquery_29=multiquery_29, multiquery_30=multiquery_30, multiquery_31=multiquery_31)

@app.route('/Register', methods=['POST', 'GET'])
def Register():
	if request.method == 'POST':
		User = mongo.db.User
		existing_user = User.find_one({'username' : request.form['username']})

		if not existing_user:
			hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
			User.insert({'username': request.form['username'], 'password': hashpass, 'first_name': request.form['first_name'], 'last_name': request.form['last_name'], 'email': request.form['email']})
			session['username'] = request.form['username']
			session['first_name'] = request.form['first_name']
			session['last_name'] = request.form['last_name']
			session['email'] = request.form['email']
			return redirect(url_for('Home'))
		return 'That username already exists!'
	return render_template('register.html', title='Register')

@app.route('/Login', methods=['POST', 'GET'])
def Login():
	if request.method == 'POST':
		User = mongo.db.User
		login_user = User.find_one({'username' : request.form['username']})

		if login_user:
			if bcrypt.hashpw(request.form['password'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
				session['username'] = login_user['username']
				session['first_name'] = login_user['first_name']
				session['last_name'] = login_user['last_name']
				session['email'] = login_user['email']
				return redirect(url_for('Home'))
	return render_template('Login.html', title='Login')

@app.route('/InsertGroup', methods=['POST', 'GET'])
def InsertGroup():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Group = mongo.db.Group
		exists = Group.find_one({'Name': request.form['Name']})

		if not exists:
			Group.insert({'Name': request.form['Name']})

	return render_template('InsertGroup.html', title='InsertGroup')

@app.route('/Groups')
def Groups():
	if not session.get('username'):
		return redirect(url_for('Login'))
	return render_template('Groups.html', title='Groups')

@app.route('/Bills', methods=['POST', 'GET'])
def Bills():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Bill = mongo.db.Bill
		exists = Bill.find_one({'desc': request.form['desc'], 'amount': request.form['amount'], 'group': request.form['group'], 'owner': request.form['owner']})

		if not exists:
			Bill.insert({'desc': request.form['desc'], 'amount': request.form['amount'], 'group': request.form['group'], 'owner': request.form['owner']})

	Group = mongo.db.Group
	group_options = Group.find({})
	User = mongo.db.User
	owner_options = User.find({})
	return render_template('Bills.html', title='Bills', group_options=group_options, owner_options=owner_options)

@app.route('/History')
def History():
	if not session.get('username'):
		return redirect(url_for('Login'))
	return render_template('History.html', title='History')

@app.route('/Settings')
def Settings():
	if not session.get('username'):
		return redirect(url_for('Login'))
	return render_template('Settings.html', title='Settings')

@app.route('/EditGroup', methods=['POST', 'GET'])
def EditGroup():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Group_users = mongo.db.Group_users
		exists = Group_users.find_one({'Group': request.form['Group'], 'User': request.form['User']})

		if not exists:
			Group_users.insert({'Group': request.form['Group'], 'User': request.form['User']})

	Group = mongo.db.Group
	Group_options = Group.find({})
	User = mongo.db.User
	User_options = User.find({})
	return render_template('EditGroup.html', title='EditGroup', Group_options=Group_options, User_options=User_options)

@app.route('/AddBill', methods=['POST', 'GET'])
def AddBill():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Bill = mongo.db.Bill
		exists = Bill.find_one({'desc': request.form['desc'], 'amount': request.form['amount'], 'group': request.form['group'], 'owner': request.form['owner']})

		if not exists:
			Bill.insert({'desc': request.form['desc'], 'amount': request.form['amount'], 'group': request.form['group'], 'owner': request.form['owner']})

	Group = mongo.db.Group
	group_options = Group.find({})
	User = mongo.db.User
	owner_options = User.find({})
	return render_template('AddBill.html', title='AddBill', group_options=group_options, owner_options=owner_options)

@app.route('/logout')
def logout():
	session.pop('username', None)
	session.pop('first_name', None)
	session.pop('last_name', None)
	session.pop('email', None)
	return redirect(url_for('Landing'))

if __name__ == "__main__":
	app.run()

app.secret_key = '\xc4\xd1\xc8@g[\x04\xbfpu\th&,\x1b\xb5\x18\x0e\x06\xbc\xad"*\xa8'