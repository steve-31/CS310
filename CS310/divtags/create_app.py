from flask import Flask
from flask_pymongo import PyMongo
import json
import re

def createApp(appJson, logo):
    g = open('./sample/sample.py', 'w+')
    g.write('from app import app')
    
    f = open('./sample/app/__init__.py', 'w+')
    f.write('from flask import Flask, render_template, url_for, request, session, redirect\n')
    f.write('from flask_pymongo import PyMongo, pymongo\n')
    f.write('from bson.objectid import ObjectId\n')
    f.write('from operator import itemgetter\n')
    f.write('import bcrypt\n\n')
    f.write('app = Flask(__name__)\n\n')
    f.write('app.config[\'MONGO_DBNAME\'] = \'SampleProject\'\n')
    f.write('app.config[\'MONGO_URI\'] = \'mongodb://127.0.0.1:27017/SampleProject\'\n\n')
    f.write('from app import routes\n\n')
    f.write('mongo = PyMongo(app)\n\n')
    
    for page in appJson['pages']:
        if not page['name'] == "AllPages":
            if page['permissions'] == "public":
                if page['homepage'] == 'yes':
                    f.write('@app.route(\'/\')\n')
            if page['name'] == "Login":
                f.write('@app.route(\'/Login\', methods=[\'POST\', \'GET\'])\n')
                f.write('def Login():\n')
                f.write('\tif request.method == \'POST\':\n')
                f.write('\t\tUser = mongo.db.User\n')
                f.write('\t\tlogin_user = User.find_one({\'username\' : request.form[\'username\']})\n\n')
                f.write('\t\tif login_user:\n')
                f.write('\t\t\tif bcrypt.hashpw(request.form[\'password\'].encode(\'utf-8\'), login_user[\'password\'].encode(\'utf-8\')) == login_user[\'password\'].encode(\'utf-8\'):\n')
                f.write('\t\t\t\tsession[\'userid\'] = str(login_user[\'_id\'])\n')
                f.write('\t\t\t\tsession[\'username\'] = login_user[\'username\']\n')
                f.write('\t\t\t\tsession[\'first_name\'] = login_user[\'first_name\']\n')
                f.write('\t\t\t\tsession[\'last_name\'] = login_user[\'last_name\']\n')
                f.write('\t\t\t\tsession[\'email\'] = login_user[\'email\']\n')
                membersHome = ""
                for page2 in appJson['pages']:
                    if not page2['name'] == "AllPages":
                        if page2['permissions'] == "members":
                            if page2['homepage'] == "yes":
                                membersHome = page2['name']
                f.write('\t\t\t\treturn redirect(url_for(\''+ membersHome +'\'))\n')
                f.write('\treturn render_template(\'Login.html\', title=\'Login\')\n\n')
                
            elif page['name'] == "Register":
                f.write('@app.route(\'/Register\', methods=[\'POST\', \'GET\'])\n')
                f.write('def Register():\n')
                f.write('\tif request.method == \'POST\':\n')
                f.write('\t\tUser = mongo.db.User\n')
                f.write('\t\texisting_user = User.find_one({\'username\' : request.form[\'username\']})\n\n')
                f.write('\t\tif not existing_user:\n')
                f.write('\t\t\thashpass = bcrypt.hashpw(request.form[\'password\'].encode(\'utf-8\'), bcrypt.gensalt())\n')
                f.write('\t\t\tUser.insert({\'username\': request.form[\'username\'], \'password\': hashpass, \'first_name\': request.form[\'first_name\'], \'last_name\': request.form[\'last_name\'], \'email\': request.form[\'email\']})\n')
                f.write('\t\t\tlogin_user = User.find_one({\'username\': request.form[\'username\']})\n')
                f.write('\t\t\tsession[\'userid\'] = str(login_user[\'_id\'])\n')
                f.write('\t\t\tsession[\'username\'] = login_user[\'username\']\n')
                f.write('\t\t\tsession[\'first_name\'] = login_user[\'first_name\']\n')
                f.write('\t\t\tsession[\'last_name\'] = login_user[\'last_name\']\n')
                f.write('\t\t\tsession[\'email\'] = login_user[\'email\']\n')
                membersHome = ""
                for page2 in appJson['pages']:
                    if not page2['name'] == "AllPages":
                        if page2['permissions'] == "members":
                            if page2['homepage'] == "yes":
                                membersHome = page2['name']
                f.write('\t\t\treturn redirect(url_for(\''+ membersHome +'\'))\n')
                f.write('\t\treturn \'That username already exists!\'\n')
                f.write('\treturn render_template(\'register.html\', title=\'Register\')\n\n')
                
            else:
                context = ""
                f.write('@app.route(\'/'+ page['name'])
                if not page['pageObject'] == "none":
                    f.write('/<'+page['pageObject']+'id>\'')
                else:
                    f.write('\'')
                if page['forms']:
                    f.write(', methods=[\'POST\', \'GET\']')
                f.write(')\n')
                f.write('def '+ page['name'] +'(')
                if not page['pageObject'] == "none":
                    f.write(page['pageObject']+'id')
                f.write('):\n')
                if page['permissions'] == "members":
                    f.write('\tif not session.get(\'username\'):\n')
                    f.write('\t\treturn redirect(url_for(\'Login\'))\n')
                if not page['pageObject'] == "none":
                    f.write('\t'+page['pageObject']+' = mongo.db.'+page['pageObject']+'\n')
                    f.write('\tpage_'+page['pageObject']+' = '+page['pageObject']+'.find_one({\'_id\': ObjectId('+page['pageObject']+'id)})\n')
                if page['forms']:
                    f.write('\tif request.method == \'POST\':\n')
                    for form in page['forms']:
                        f.write('\t\t'+ form['object'] +' = mongo.db.'+ form['object'] +'\n')
                        
                        for field in form['fields']:
                            if field['type'] == "Calculated":
                                f.write('\t\t'+ field['label'] +'_calculated =')
                                details = field['details'].split()
                                for element in details:
                                    if re.match(r'[0-9]+', element):
                                        f.write(' '+element)
                                    elif re.match(r'[*+/\-mod]', element):
                                        if re.match(r'mod', element):
                                            f.write(' %')
                                        else:
                                            f.write(' '+element)
                                    else:
                                        f.write(' int(request.form[\''+element+'\'])')
                                f.write('\n')
                        if form['type'] == "add":
                            f.write('\t\texists = '+ form['object'] +'.find_one({')
                            for index, field in enumerate(form['fields']):
                                if field['type'] == "Calculated":
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': '+ field['label'] +'_calculated')
                                    else:
                                        f.write(', \''+ field['label'] +'\': '+ field['label'] +'_calculated')
                                elif field['type'] == "Number":
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': float(request.form[\''+ field['label'] +'\'])')
                                    else:
                                        f.write(', \''+ field['label'] +'\': float(request.form[\''+ field['label'] +'\'])')
                                else:
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': request.form[\''+ field['label'] +'\']')
                                    else:
                                        f.write(', \''+ field['label'] +'\': request.form[\''+ field['label'] +'\']')
                            f.write('})\n\n')
                            f.write('\t\tif not exists:\n')
                            f.write('\t\t\t'+ form['object'] +'.insert({')
                            for index, field in enumerate(form['fields']):
                                if field['type'] == "Calculated":
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': '+ field['label'] +'_calculated')
                                    else:
                                        f.write(', \''+ field['label'] +'\': '+ field['label'] +'_calculated')
                                elif field['type'] == "Number":
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': float(request.form[\''+ field['label'] +'\'])')
                                    else:
                                        f.write(', \''+ field['label'] +'\': float(request.form[\''+ field['label'] +'\'])')
                                else:
                                    if index == 0:
                                        f.write('\''+ field['label'] +'\': request.form[\''+ field['label'] +'\']')
                                    else:
                                        f.write(', \''+ field['label'] +'\': request.form[\''+ field['label'] +'\']')
                            f.write('})\n\n')
                        elif form['type'] == "verify":
                            pass
                        elif form['type'] == "update":
                            pass
                for query in page['queries']:
                    if query['query']['comparator'] == "userId":
                        f.write("\tquery_"+ str(query['id']) +" = session['"+ query['display']['field'] +"']\n")
                    elif query['query']['comparator'] == "pageId":
                        f.write("\tquery_"+ str(query['id']) +" = page_"+ query['display']['object'] +"['"+ query['display']['field'] +"']\n")
                    else:
                        f.write('\t'+ query['query']['object'] +' = mongo.db.'+ query['query']['object'] +'\n')
                        if query['query']['type'] == "search-single":
                            f.write("\tquery_"+ str(query['id']) +" = "+ query['query']['object'] +".find_one({\'"+ query['query']['field'] +"\' : ")
                        elif query['query']['type'] == "search-mutliple":
                            f.write("\tquery_"+ str(query['id']) +" = "+ query['query']['object'] +".find({\'"+ query['query']['field'] +"\' : ")
                        if query['query']['comparatorType'] == "value":
                            f.write('"'+query['query']['comparator'] +'"})\n')
                        elif query['query']['comparatorType'] == "userId":
                            f.write("session["+query['query']['comparator'] +"]})\n")
                    context += ", query_"+ str(query['id']) +"=query_"+ str(query['id'])
                for multiquery in page['multiqueries']:
                    if not multiquery['query']:
                        f.write('\t'+multiquery['display']['object']+' = mongo.db.'+multiquery['display']['object']+'\n')
                        f.write('\tmultiquery_test_'+str(multiquery['id'])+' = '+multiquery['display']['object']+'.find({})')
                        if not multiquery['orderby'] == "None":
                            f.write('.sort(\''+multiquery['orderfield']+'\', pymongo.')
                            if multiquery['orderby'] == "Asc":
                                f.write('ASCENDING)')
                            else:
                                f.write('DESCENDING)')
                        if not multiquery['limit'] == 0:
                            f.write('.limit('+multiquery['limit']+')')
                        f.write('\n')
                        f.write('\tmultiquery_'+str(multiquery['id'])+' = []\n')
                        f.write('\tfor mq in multiquery_test_'+str(multiquery['id'])+':\n')
                        for object in appJson['objects']:
                            if object['name'] == multiquery['display']['object']:
                                for multiqueryfield in multiquery['display']['fields']:
                                    for objectfield in object['attributes']:
                                        if multiqueryfield['name'] == objectfield['name']:
                                            if objectfield['type'] == "Reference":
                                                f.write('\t\t'+objectfield['details']+' = mongo.db.'+objectfield['details']+'\n')
                                                f.write('\t\tfind_referenced_'+multiqueryfield['name']+' = '+objectfield['details']+'.find_one({\'_id\': ObjectId(str(mq[\''+multiqueryfield['name']+'\']))})\n')
                                                found_field_name = False
                                                for object2 in appJson['objects']:
                                                    if object2['name'] == objectfield['details']:
                                                        for objectfield2 in object2['attributes']:
                                                            if objectfield2['name'] == "name" or objectfield2['name'] == "Name" or objectfield2['name'] == "username":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                            if objectfield2['name'] == "desc" or objectfield2['name'] == "Desc" or objectfield2['name'] == "description" or objectfield2['name'] == "Description":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                        if not found_field_name:
                                                            f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ object['name'] +'\'] + \' \' + find_referenced_group[\'_id\']\n')
                        f.write('\t\tmultiquery_'+str(multiquery['id'])+'.append(mq)\n')
                    elif multiquery['query']['comparatorType'] == "query":
                        f.write('\t'+multiquery['query']['comparator']['query']['object']+' = mongo.db.'+multiquery['query']['comparator']['query']['object']+'\n')
                        f.write('\tnestedquery_'+str(multiquery['id'])+' = '+ multiquery['query']['comparator']['query']['object']+'.find({')
                        if multiquery['query']['comparator']['query']['field'] == "primary_key":
                            f.write('\'_id\': ObjectId('+multiquery['query']['comparator']['query']['comparator']+')})\n')
                        else:
                            f.write('\''+multiquery['query']['comparator']['query']['field']+'\': ')
                            if multiquery['query']['comparator']['query']['comparatorType'] == "value":
                                f.write('"'+multiquery['query']['comparator']['query']['comparator'] +'"})\n')
                            elif multiquery['query']['comparator']['query']['comparatorType'] == "userId":
                                if multiquery['query']['comparator']['query']['comparator'] == "primary_key":
                                    f.write("session[\'userid\']})\n")
                                else:
                                    f.write("session["+query['query']['comparator'] +"]})\n")
                            elif multiquery['query']['comparator']['query']['comparatorType'] == "page":
                                if multiquery['query']['comparator']['query']['comparator'] == "primary_key":
                                    f.write("str(page_"+ page['pageObject']+"[\'_id\'])})\n")
                                else:
                                    f.write("str(page_"+ page['pageObject']+"[\'"+ multiquery['query']['comparator']['query']['comparator']+"\'])})\n")
                        f.write('\tnested = []\n')
                        f.write('\tfor n in nestedquery_'+str(multiquery['id'])+':\n')
                        f.write('\t\tnested.append(n[\''+multiquery['query']['comparator']['display']['field']+'\'])\n')
                        f.write('\t'+multiquery['query']['object']+' = mongo.db.'+multiquery['query']['object']+'\n')
                        f.write('\tmultiquery_test_'+str(multiquery['id'])+' = []\n')
                        f.write('\tfor n in nested:\n')
                        f.write('\t\tfind = '+multiquery['query']['object']+'.find({')
                        if multiquery['query']['field'] == "primary_key":
                            f.write('\'_id\': ObjectId(n)})\n')
                        else:
                            f.write('\''+multiquery['query']['field']+'\': n})\n')
                        f.write('\t\tfor f in find:\n')
                        f.write('\t\t\tmultiquery_test_'+str(multiquery['id'])+'.append(f)\n')
                        f.write('\tmultiquery_'+str(multiquery['id'])+' = []\n')
                        f.write('\tfor mq in multiquery_test_'+str(multiquery['id'])+':\n')
                        for object in appJson['objects']:
                            if object['name'] == multiquery['query']['object']:
                                for multiqueryfield in multiquery['display']['fields']:
                                    for objectfield in object['attributes']:
                                        if multiqueryfield['name'] == objectfield['name']:
                                            if objectfield['type'] == "Reference":
                                                f.write('\t\t'+objectfield['details']+' = mongo.db.'+objectfield['details']+'\n')
                                                f.write('\t\tfind_referenced_'+multiqueryfield['name']+' = '+objectfield['details']+'.find_one({\'_id\': ObjectId(str(mq[\''+multiqueryfield['name']+'\']))})\n')
                                                found_field_name = False
                                                for object2 in appJson['objects']:
                                                    if object2['name'] == objectfield['details']:
                                                        for objectfield2 in object2['attributes']:
                                                            if objectfield2['name'] == "name" or objectfield2['name'] == "Name" or objectfield2['name'] == "username":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                            if objectfield2['name'] == "desc" or objectfield2['name'] == "Desc" or objectfield2['name'] == "description" or objectfield2['name'] == "Description":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                        if not found_field_name:
                                                            f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ object['name'] +'\'] + \' \' + find_referenced_group[\'_id\']\n')
                        f.write('\t\tmultiquery_'+str(multiquery['id'])+'.append(mq)\n')
                        if not multiquery['orderby'] == "None":
                            f.write('\tmultiquery_'+str(multiquery['id'])+' = sorted(multiquery_'+str(multiquery['id'])+', key=itemgetter(\''+multiquery['orderfield']+'\'))\n')
                            if multiquery['orderby'] == "Desc":
                                f.write('\tmultiquery_'+str(multiquery['id'])+'.reverse()\n')
                        if not int(multiquery['limit']) == 0:
                            f.write('\tmultiquery_'+str(multiquery['id'])+' = multiquery_'+str(multiquery['id'])+'[0:'+multiquery['limit']+']\n')
                    else:
                        f.write('\t'+multiquery['query']['object']+' = mongo.db.'+multiquery['query']['object']+'\n')
                        f.write('\tmultiquery_test_'+str(multiquery['id'])+' = '+multiquery['query']['object']+'.find({\''+multiquery['query']['field']+'\': ')
                        if multiquery['query']['comparatorType'] == "value":
                            f.write('"'+multiquery['query']['comparator'] +'"})')
                        elif multiquery['query']['comparatorType'] == "userId":
                            if multiquery['query']['comparator'] == "primary_key":
                                f.write("session['userid']})")
                            else:
                                f.write("session["+multiquery['query']['comparator'] +"]})")
                        elif multiquery['query']['comparatorType'] == "page":
                            if multiquery['query']['comparator'] == "primary_key":
                                f.write("str(page_"+page['pageObject']+"['_id'])})")
                            else:
                                f.write("str(page_"+page['pageObject']+"["+multiquery['query']['comparator'] +"])})")
                        if not multiquery['orderby'] == "None":
                            f.write('.sort(\''+multiquery['orderfield']+'\', pymongo.')
                            if multiquery['orderby'] == "Asc":
                                f.write('ASCENDING)')
                            else:
                                f.write('DESCENDING)')
                        if not multiquery['limit'] == 0:
                            f.write('.limit('+multiquery['limit']+')')
                        f.write('\n')
                        f.write('\tmultiquery_'+str(multiquery['id'])+' = []\n')
                        f.write('\tfor mq in multiquery_test_'+str(multiquery['id'])+':\n')
                        for object in appJson['objects']:
                            if object['name'] == multiquery['query']['object']:
                                for multiqueryfield in multiquery['display']['fields']:
                                    for objectfield in object['attributes']:
                                        if multiqueryfield['name'] == objectfield['name']:
                                            if objectfield['type'] == "Reference":
                                                f.write('\t\t'+objectfield['details']+' = mongo.db.'+objectfield['details']+'\n')
                                                f.write('\t\tfind_referenced_'+multiqueryfield['name']+' = '+objectfield['details']+'.find_one({\'_id\': ObjectId(str(mq[\''+multiqueryfield['name']+'\']))})\n')
                                                found_field_name = False
                                                for object2 in appJson['objects']:
                                                    if object2['name'] == objectfield['details']:
                                                        for objectfield2 in object2['attributes']:
                                                            if objectfield2['name'] == "name" or objectfield2['name'] == "Name" or objectfield2['name'] == "username":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                            if objectfield2['name'] == "desc" or objectfield2['name'] == "Desc" or objectfield2['name'] == "description" or objectfield2['name'] == "Description":
                                                                f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ objectfield2['name'] +'\']\n')
                                                                found_field_name = True
                                                                break
                                                        if not found_field_name:
                                                            f.write('\t\tmq[\''+multiqueryfield['name']+'\'] = find_referenced_'+multiqueryfield['name']+'[\''+ object['name'] +'\'] + \' \' + find_referenced_group[\'_id\']\n')
                        f.write('\t\tmultiquery_'+str(multiquery['id'])+'.append(mq)\n')
                    context += ", multiquery_"+ str(multiquery['id']) +"=multiquery_"+ str(multiquery['id'])
                for form in page['forms']:
                    for field in form['fields']:
                        if field['type'] == "Reference":
                            f.write('\t'+ field['details'] +' = mongo.db.'+ field['details'] +'\n')
                            f.write('\t'+ field['label'] +'_options = '+ field['details'] +'.find({})\n')
                            context += ", "+ field['label'] +"_options="+ field['label'] +"_options"
                f.write('\treturn render_template(\''+ page['name'] +'.html\', title=\''+ page['name'] +'\''+ context +')\n\n')
            
            createHTMLPage(appJson, page, logo)
    
    f.write('@app.route(\'/logout\')\n')
    f.write('def logout():\n')
    f.write('\tsession.pop(\'username\', None)\n')
    f.write('\tsession.pop(\'userid\', None)\n')
    f.write('\tsession.pop(\'first_name\', None)\n')
    f.write('\tsession.pop(\'last_name\', None)\n')
    f.write('\tsession.pop(\'email\', None)\n')
    publicHome = ""
    for page2 in appJson['pages']:
        if not page2['name'] == "AllPages":
            if page2['permissions'] == "public":
                if page2['homepage'] == "yes":
                    publicHome = page2['name']
    f.write('\treturn redirect(url_for(\''+ publicHome +'\'))\n\n')
    
    f.write('if __name__ == "__main__":\n\tapp.run()\n\n')
    
    f.write('app.secret_key = \'\\xc4\\xd1\\xc8@g[\\x04\\xbfpu\\th&,\\x1b\\xb5\\x18\\x0e\\x06\\xbc\\xad"*\\xa8\'')
        


def createHTMLPage(appJson, page, logo):
    homepage = None
    h = open('./sample/app/templates/'+ page['name'] +'.html', 'w+')
    c = open('./sample/app/static/css/style.css', 'w+')
    j = open('./sample/app/static/js/load.js', 'w+')
    
    h.write('<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset=\"UTF-8\">\n\t\t<link href="http://fonts.googleapis.com/css?family=Lato:300,400,400italic,600,700|Raleway:300,400,500,600,700|Crete+Round:400italic" rel="stylesheet" type="text/css" />\n\t\t<link rel=stylesheet type=text/css href="{{ url_for(\'static\', filename=\'css/bootstrap.css\') }}">\n\t\t<link rel=stylesheet type=text/css href="{{ url_for(\'static\', filename=\'css/base-style.css\') }}">\n\t\t<link rel=stylesheet type=text/css href="{{ url_for(\'static\', filename=\'css/style.css\') }}">\n\t\t<title>{{ title }}</title>\n\t</head>\n\t<body>\n')
    h.write('\t\t<div class=\"user-header\" id=\"user-header\">\n')
    h.write('\t\t\t<div id=\"primary-menu-trigger\"><i class=\"icon-reorder\"></i></div>\n')
    for testhome in appJson['pages']:
        if not testhome['name'] == "AllPages": 
            if testhome['homepage'] == "yes":
                homepage = testhome
    if logo:
        h.write('\t\t\t<div id="user-logo"><a href="/"><img id="project-logo" src="{{ url_for(\'static\', filename=\'img/logo.PNG\') }}"></a></div>\n')
    else:
        h.write('\t\t\t<div id="user-logo"><a href="/"><span style="line-height:60px;font-size:30px;">'+ appJson['name'] +'</span></a></div>\n')
    h.write('\t\t\t<nav id="user-menu">\n')
    h.write('\t\t\t\t<ul id="user-menu-pages-list">\n')
    h.write('\t\t\t\t{% if session[\'username\'] %}\n')
    for p in appJson['pages']:
        if not p['name'] == "AllPages":
            if p['permissions'] == "members":
                if p['showinheader'] == "yes":
                    h.write('\t\t\t\t\t<li><a href=\"{{ url_for(\''+ p['name'] +'\') }}\">'+p['name']+'</a></li>\n')
    h.write('\t\t\t\t\t<li><a href=\"{{ url_for(\'logout\') }}\">Logout</a></li>\n')
    h.write('\t\t\t\t{% else %}\n')
    for p in appJson['pages']:
        if not p['name'] == "AllPages": 
            if p['permissions'] == "public":
                if p['showinheader'] == "yes":
                    h.write('\t\t\t\t\t<li><a href=\"{{ url_for(\''+ p['name'] +'\') }}\">'+p['name']+'</a></li>\n')
    h.write('\t\t\t\t{% endif %}\n')
    h.write('\t\t\t\t</ul>\n')
    h.write('\t\t\t</nav>\n')
    h.write('\t\t</div>\n')
    h.write('\t\t<div class=\'element-container\'>\n')
    for element in page['elements']:
        if re.match(r'^<form.*', element['content']):
            formid = -1
            style = ""
            idstring = re.search(r'id="(?P<id>\d+)"', element['content'])
            if idstring:
                formid = idstring.group('id')
                formidint = int(formid)
            
            stylestring = re.search(r'style="(?P<style>[0-9a-zA-Z :\-(),.;]+)"', element['content'])
            if stylestring:
                style = stylestring.group('style')
            
            formjson = {}
            for form in page['forms']:
                if form['id'] == formidint:
                    formjson = form
            
            h.write('<form class="element" id="'+ formid +'" method=POST action=\"{{ url_for(\''+ page['name'] +'\') }}" style="'+ style +'">\n')
            for field in formjson['fields']:
                if not field['type'] == "primaryKey" and not field['type'] == "Calculated":
                    h.write('\t<div class="form-group">\n')
                    h.write('\t\t<label for="'+ field['label'] +'-field">'+ field['label'] +'</label>\n')
                    if field['type'] == "Text":
                        if field['label'] == "password":
                            h.write('\t\t<input type="password" class="form-control" name="'+ field['label'] +'">\n')
                        else:
                            h.write('\t\t<input type="text" class="form-control" name="'+ field['label'] +'">\n')
                    elif field['type'] == "Number":
                        h.write('\t\t<input type="number" class="form-control" name="'+ field['label'] +'">\n')
                    elif field['type'] == "Date":
                        h.write('\t\t<input type="date" class="form-control" name="'+ field['label'] +'">\n')
                    elif field['type'] == "Reference":
                        h.write('\t\t<select class="form-control" name="'+ field['label'] +'">\n')
                        h.write('\t\t{% for option in '+field['label']+'_options %}\n')
                        found_field_name = False
                        formobject = {}
                        for object1 in appJson['objects']:
                            if object1['name'] == field['details']:
                                formobject = object1
                        for objectfield in formobject['attributes']:
                            if objectfield['name'] == "name" or objectfield['name'] == "Name" or objectfield['name'] == "username":
                                h.write('\t\t\t<option value="{{ option._id }}">{{ option.'+ objectfield['name'] +' }}</option>\n')
                                found_field_name = True
                                break
                            if objectfield['name'] == "desc" or objectfield['name'] == "Desc" or objectfield['name'] == "description" or objectfield['name'] == "Description":
                                h.write('\t\t\t<option value="{{ option._id }}">{{ option.'+ objectfield['name'] +' }}</option>\n')
                                found_field_name = True
                                break
                        if not found_field_name:
                            h.write('\t\t\t<option value="{{ option._id }}">{{ option.'+ formobject['name'] +' }} - {{ option._id }}</option>\n')
                        h.write('\t\t{% endfor %}\n')
                        h.write('\t\t</select>\n')
                    h.write('\t</div>\n')
            form_object_name = ""
            h.write('\t<button type="submit" class="btn btn-block" style="text-transform:uppercase;">'+ formjson['type'] +' '+ formjson['object'] +'</button>\n')
            h.write('</form>\n')
        elif re.match(r'^<div class="element" id="(?P<imgid>[0-9]+)" onclick="[A-Za-z\(\)\.]+" style="(?P<style>[0-9a-zA-Z :\-(),\.;]+)"><img src="(?P<imgUrl>[A-Za-z0-9\/_\-\.]+)"><\/div>', element['content']):
            image = re.match(r'^<div class="element" id="(?P<imgid>[0-9]+)" onclick="[A-Za-z\(\)\.]+" style="(?P<style>[0-9a-zA-Z :\-(),\.;]+)"><img src="(?P<imgUrl>[A-Za-z0-9\/_\-\.]+)"><\/div>', element['content'])
            img_url = image.group('imgUrl')
            img_url = img_url.split("/")
            img_name = img_url[len(img_url)-1]
            
            img_style = image.group('style')
            img_id = image.group('imgid')
            
            h.write('<img class="element" id="'+img_id+'" style="'+img_style+'" src="{{ url_for(\'static\', filename=\'img/'+img_name+'\') }}"></img>\n')
            
        elif re.search(r'query-(?P<queryid>[0-9]+)', element['content']):
            queryjson = {}
            queryid = re.search(r'query-(?P<queryid>[0-9]+)', element['content']).group('queryid')
            for query in page['queries']:
                if query['id'] == int(queryid):
                    queryjson = query
            text_to_insert = ""
            if queryjson['query']['type'] == "search-single":
                text_to_insert = "{{ query_" + queryid + "."+ queryjson['display']['field'] +" }}"
            elif queryjson['query']['type'] == "page":
                text_to_insert = "{{ query_" + queryid + " }}"
            elif queryjson['query']['type'] == "user":
                text_to_insert = "{{ query_" + queryid + " }}"
            h.write(re.sub(r'<span.*</span>', text_to_insert, element['content'])+ '\n')
        elif re.search(r'<table', element['content']):
            tablediv = re.search(r'(?P<divtable><div class=".*" id="(?P<tableid>[0-9]+)" onclick=".*" style=".*;">)', element['content'])
            div = tablediv.group('divtable')
            h.write(div+'\n')
            tableid = tablediv.group('tableid')
            h.write('\t<table class="table">\n')
            multi_query_json = {}
            for multiquery in page['multiqueries']:
                if multiquery['id'] == int(tableid):
                    multi_query_json = multiquery
            if multi_query_json['headings'] == "yes":
                h.write('\t\t<tr>\n')
                for table_field in multi_query_json['display']['fields']:
                    h.write('\t\t\t<th>'+table_field['name']+'</th>\n')
                h.write('\t\t</tr>\n')
            h.write('\t\t{% for row in multiquery_'+str(multi_query_json['id'])+' %}\n')
            h.write('\t\t<tr>\n')
            for table_field in multi_query_json['display']['fields']:
                if not multi_query_json['link'] == "none":
                    h.write('\t\t\t<td><a href="{{ url_for(\''+multi_query_json['link']+'\', '+multi_query_json['display']['object']+'id=row._id) }}">{{ row.'+table_field['name']+' }}</a></td>\n')
                else:
                    h.write('\t\t\t<td>{{ row.'+table_field['name']+' }}</td>\n')
            h.write('\t\t</tr>\n')
            h.write('\t\t{% endfor %}\n')
            h.write('\t</table>\n')
            h.write('</div>\n')
        else:
            id = re.search(r'id="(?P<elementid>[0-9]+)"', element['content'])
            elementid = id.group('elementid')
            elementlink = False
            for link in page['links']:
                if int(link['id']) == int(elementid):
                    elementlink = True
                    h.write('<a href="{{ url_for(\''+ link['page'] +'\') }}">'+ element['content'].encode('utf-8') +'</a>\n')
            if not elementlink:
                h.write(element['content'].encode('utf-8') + '\n')
    h.write('\t\t</div>\n')
    h.write('\t\t<script type="text/javascript" src="{{ url_for(\'static\', filename=\'js/load.js\') }}"></script>\n')
    h.write('\t</body>\n</html>')
    
    
    c.write('body {\n\tmargin: 0;\n\tpadding: 0;\n\twidth: 100%;\n\tbackground-color: '+ page['background'] +';\n\tfont-family: \'Lato\', sans-serif;\n}\n\n')
    c.write('.user-header {\n\tposition: fixed;\n\ttop: 0px;\n\twidth: 100%;\n\theight: 60px;\n\tcolor: '+ appJson['headerTextColour'] +';\n\tbackground-color: '+ appJson['headerBackgroundColour'] +';\n\tpadding-left: 15%;\n\tpadding-right: 15%;\n\tz-index: 100;\n}\n\n')
    c.write('#user-logo {\n\tdisplay: inline-block;\n\theight: 60px;\n}\n\n')
    c.write('#user-menu {\n\tfloat: right;\n\tdisplay: inline-block;\n}\n\n')
    c.write('#user-menu-pages-list {\n\tmargin: 0;\n\tmargin-bottom: 30px;\n}\n\n')
    c.write('#user-menu-pages-list li {\n\ttext-decoration: none;\n\tdisplay: inline;\n\tline-height: 60px;\n\tpadding-left: 20px;\n\tpadding-right: 20px;\n\tfont-size: 20px;\n}\n\n')
    c.write('#user-menu-pages-list li a, #user-logo a {\n\ttext-decoration: none;\n\tcolor: '+ appJson['headerTextColour'] +';\n}\n\n')
    c.write('.element-container {\n\tmargin-left: 10%;\n\tmargin-right: 10%;\n\tpadding-top: 60px;\n\tposition: relative;\n}\n\n')
    c.write('.element {\n\tposition: absolute;\n\tmargin: 0px;\n}\n\n')
    c.write('#project-logo {\n\theight:60px;\n}\n\n')
    
    
    j.write('window.onload = processElements();\n\n')
    j.write('function processElements() {\n')
    j.write('\telements = document.getElementsByClassName("element");\n')
    j.write('\tfor (i in elements) {\n')
    j.write('\t\telements[i].onclick = null;\n\t}\n')
    j.write('\ttext = document.getElementsByClassName("element-text");\n')
    j.write('\tfor (i in text) {\n')
    j.write('\t\ttext[i].contentEditable = false;\n\t}\n}\n')
    
