from flask import Flask, render_template, url_for, request, session, redirect
from flask_pymongo import PyMongo, pymongo
from bson.objectid import ObjectId
from operator import itemgetter
import bcrypt

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'SampleProject'
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/SampleProject'

from app import routes

mongo = PyMongo(app)

@app.route('/')
@app.route('/Home')
def Home():
	return render_template('Home.html', title='Home')

@app.route('/Register', methods=['POST', 'GET'])
def Register():
	if request.method == 'POST':
		User = mongo.db.User
		existing_user = User.find_one({'username' : request.form['username']})

		if not existing_user:
			hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
			User.insert({'username': request.form['username'], 'password': hashpass, 'first_name': request.form['first_name'], 'last_name': request.form['last_name'], 'email': request.form['email']})
			login_user = User.find_one({'username': request.form['username']})
			session['userid'] = str(login_user['_id'])
			session['username'] = login_user['username']
			session['first_name'] = login_user['first_name']
			session['last_name'] = login_user['last_name']
			session['email'] = login_user['email']
			return redirect(url_for('MembersHome'))
		return 'That username already exists!'
	return render_template('register.html', title='Register')

@app.route('/Login', methods=['POST', 'GET'])
def Login():
	if request.method == 'POST':
		User = mongo.db.User
		login_user = User.find_one({'username' : request.form['username']})

		if login_user:
			if bcrypt.hashpw(request.form['password'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):
				session['userid'] = str(login_user['_id'])
				session['username'] = login_user['username']
				session['first_name'] = login_user['first_name']
				session['last_name'] = login_user['last_name']
				session['email'] = login_user['email']
				return redirect(url_for('MembersHome'))
	return render_template('Login.html', title='Login')

@app.route('/MembersHome')
def MembersHome():
	if not session.get('username'):
		return redirect(url_for('Login'))
	query_0 = session['first_name']
	Division = mongo.db.Division
	multiquery_test_17 = Division.find({}).limit(0)
	multiquery_17 = []
	for mq in multiquery_test_17:
		multiquery_17.append(mq)
	return render_template('MembersHome.html', title='MembersHome', query_0=query_0, multiquery_17=multiquery_17)

@app.route('/newDivision', methods=['POST', 'GET'])
def newDivision():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Division = mongo.db.Division
		exists = Division.find_one({'Name': request.form['Name']})

		if not exists:
			Division.insert({'Name': request.form['Name']})

	return render_template('newDivision.html', title='newDivision')

@app.route('/Newinvoice', methods=['POST', 'GET'])
def Newinvoice():
	if not session.get('username'):
		return redirect(url_for('Login'))
	if request.method == 'POST':
		Invoice = mongo.db.Invoice
		AmountNoTax_calculated = int(request.form['Amount']) * 0.8
		exists = Invoice.find_one({'Description': request.form['Description'], 'Amount': float(request.form['Amount']), 'AmountNoTax': AmountNoTax_calculated, 'Claimant': request.form['Claimant'], 'Division': request.form['Division'], 'Date': request.form['Date']})

		if not exists:
			Invoice.insert({'Description': request.form['Description'], 'Amount': float(request.form['Amount']), 'AmountNoTax': AmountNoTax_calculated, 'Claimant': request.form['Claimant'], 'Division': request.form['Division'], 'Date': request.form['Date']})

	User = mongo.db.User
	Claimant_options = User.find({})
	Division = mongo.db.Division
	Division_options = Division.find({})
	return render_template('Newinvoice.html', title='Newinvoice', Claimant_options=Claimant_options, Division_options=Division_options)

@app.route('/Division/<Divisionid>')
def Division(Divisionid):
	if not session.get('username'):
		return redirect(url_for('Login'))
	Division = mongo.db.Division
	page_Division = Division.find_one({'_id': ObjectId(Divisionid)})
	query_0 = page_Division['Name']
	objectReset = mongo.db.objectReset
	multiquery_test_24 = objectReset.find({'Division': str(page_Division['_id'])}).sort('Date', pymongo.DESCENDING).limit(0)
	multiquery_24 = []
	for mq in multiquery_test_24:
		multiquery_24.append(mq)
	return render_template('Division.html', title='Division', query_0=query_0, multiquery_24=multiquery_24)

@app.route('/logout')
def logout():
	session.pop('username', None)
	session.pop('userid', None)
	session.pop('first_name', None)
	session.pop('last_name', None)
	session.pop('email', None)
	return redirect(url_for('Home'))

if __name__ == "__main__":
	app.run()

app.secret_key = '\xc4\xd1\xc8@g[\x04\xbfpu\th&,\x1b\xb5\x18\x0e\x06\xbc\xad"*\xa8'