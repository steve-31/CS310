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
@app.route('/Landing')
def Landing():
	return render_template('Landing.html', title='Landing')

@app.route('/Home')
def Home():
	if not session.get('username'):
		return redirect(url_for('Login'))
	query_0 = session['first_name']
	Bill = mongo.db.Bill
	multiquery_test_30 = Bill.find({'amount': "0"}).limit(5)
	multiquery_30 = []
	for mq in multiquery_test_30:
		find_referenced_group = Group.find_one({'_id': ObjectId(str(mq['group']))})
		mq['group'] = find_referenced_group['Name']
		multiquery_30.append(mq)
	Group_users = mongo.db.Group_users
	nestedquery_39 = Group_users.find({'User': session['userid']})
	nested = []
	for n in nestedquery_39:
		nested.append(n['Group'])
	Group = mongo.db.Group
	multiquery_test_39 = []
	for n in nested:
		find = Group.find({'_id': ObjectId(n)})
		for f in find:
			multiquery_test_39.append(f)
	multiquery_39 = []
	for mq in multiquery_test_39:
		multiquery_39.append(mq)
	multiquery_39 = sorted(multiquery_39, key=itemgetter('Name'))
	Group_users = mongo.db.Group_users
	nestedquery_35 = Group_users.find({'User': session['userid']})
	nested = []
	for n in nestedquery_35:
		nested.append(n['Group'])
	Bill = mongo.db.Bill
	multiquery_test_35 = []
	for n in nested:
		find = Bill.find({'group': n})
		for f in find:
			multiquery_test_35.append(f)
	multiquery_35 = []
	for mq in multiquery_test_35:
		Group = mongo.db.Group
		find_referenced_group = Group.find_one({'_id': ObjectId(str(mq['group']))})
		mq['group'] = find_referenced_group['Name']
		User = mongo.db.User
		find_referenced_owner = User.find_one({'_id': ObjectId(str(mq['owner']))})
		mq['owner'] = find_referenced_owner['username']
		multiquery_35.append(mq)
	multiquery_35 = sorted(multiquery_35, key=itemgetter('amount'))
	multiquery_35.reverse()
	multiquery_35 = multiquery_35[0:5]
	Bill = mongo.db.Bill
	multiquery_test_36 = Bill.find({'owner': session['userid']}).sort('amount', pymongo.DESCENDING).limit(5)
	multiquery_36 = []
	for mq in multiquery_test_36:
		find_referenced_group = Group.find_one({'_id': ObjectId(str(mq['group']))})
		mq['group'] = find_referenced_group['Name']
		multiquery_36.append(mq)
	return render_template('Home.html', title='Home', query_0=query_0, multiquery_30=multiquery_30, multiquery_39=multiquery_39, multiquery_35=multiquery_35, multiquery_36=multiquery_36)

@app.route('/Register', methods=['POST', 'GET'])
def Register():
	if request.method == 'POST':
		User = mongo.db.User
		existing_user = User.find_one({'username' : request.form['username']})

		if not existing_user:
			hashpass = bcrypt.hashpw(request.form['password'].encode('utf-8'), bcrypt.gensalt())
			User.insert({'username': request.form['username'], 'password': hashpass, 'first_name': request.form['first_name'], 'last_name': request.form['last_name'], 'email': request.form['email']})
			login_user = User.find_one({'username': request.form['username']})
			session['userid'] = login_user['_id']
			session['username'] = login_user['username']
			session['first_name'] = login_user['first_name']
			session['last_name'] = login_user['last_name']
			session['email'] = login_user['email']
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
				session['userid'] = login_user['_id']
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

@app.route('/Group/<Groupid>')
def Group(Groupid):
	if not session.get('username'):
		return redirect(url_for('Login'))
	Group = mongo.db.Group
	page_Group = Group.find_one({'_id': ObjectId(Groupid)})
	query_0 = page_Group['Name']
	Group_users = mongo.db.Group_users
	nestedquery_32 = Group_users.find({'Group': str(page_Group['_id'])})
	nested = []
	for n in nestedquery_32:
		nested.append(n['User'])
	User = mongo.db.User
	multiquery_test_32 = []
	for n in nested:
		find = User.find({'_id': ObjectId(n)})
		for f in find:
			multiquery_test_32.append(f)
	multiquery_32 = []
	for mq in multiquery_test_32:
		multiquery_32.append(mq)
	multiquery_32 = sorted(multiquery_32, key=itemgetter('username'))
	Bill = mongo.db.Bill
	multiquery_test_58 = Bill.find({'group': str(page_Group['_id'])}).sort('amount', pymongo.DESCENDING).limit(5)
	multiquery_58 = []
	for mq in multiquery_test_58:
		find_referenced_group = Group.find_one({'_id': ObjectId(str(mq['group']))})
		mq['group'] = find_referenced_group['Name']
		find_referenced_owner = User.find_one({'_id': ObjectId(str(mq['owner']))})
		mq['owner'] = find_referenced_owner['username']
		multiquery_58.append(mq)
	return render_template('Group.html', title='Group', query_0=query_0, multiquery_32=multiquery_32, multiquery_58=multiquery_58)

@app.route('/Bills')
def Bills():
	if not session.get('username'):
		return redirect(url_for('Login'))
	Group_users = mongo.db.Group_users
	nestedquery_21 = Group_users.find({'User': session['userid']})
	nested = []
	for n in nestedquery_21:
		nested.append(n['Group'])
	Bill = mongo.db.Bill
	multiquery_test_21 = []
	for n in nested:
		find = Bill.find({'group': n})
		for f in find:
			multiquery_test_21.append(f)
	multiquery_21 = []
	for mq in multiquery_test_21:
		Group = mongo.db.Group
		find_referenced_group = Group.find_one({'_id': ObjectId(str(mq['group']))})
		mq['group'] = find_referenced_group['Name']
		User = mongo.db.User
		find_referenced_owner = User.find_one({'_id': ObjectId(str(mq['owner']))})
		mq['owner'] = find_referenced_owner['username']
		multiquery_21.append(mq)
	multiquery_21 = sorted(multiquery_21, key=itemgetter('amount'))
	multiquery_21.reverse()
	return render_template('Bills.html', title='Bills', multiquery_21=multiquery_21)

@app.route('/History')
def History():
	if not session.get('username'):
		return redirect(url_for('Login'))
	return render_template('History.html', title='History')

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
		exists = Bill.find_one({'desc': request.form['desc'], 'amount': float(request.form['amount']), 'group': request.form['group'], 'owner': request.form['owner']})

		if not exists:
			Bill.insert({'desc': request.form['desc'], 'amount': float(request.form['amount']), 'group': request.form['group'], 'owner': request.form['owner']})

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