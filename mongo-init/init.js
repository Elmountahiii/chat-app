db = db.getSiblingDB('chatAppDB');

db.createCollection('users');
db.createCollection('messages');
