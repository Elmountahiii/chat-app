const db = db.getSiblingDB('chatapp');

db.createCollection('users');
db.createCollection('messages');
db.createCollection('conversations');
db.createCollection('friendships');
