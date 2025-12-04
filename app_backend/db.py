import tornado, asyncio
from pymongo import AsyncMongoClient

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "bacheca_db"
COOKIE_SECRET = "super_secret_key_change_me"
PORT = 8888

client = AsyncMongoClient(MONGO_URL)
db = client[DB_NAME]

users = db["users"]
messages = db["messages"]

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_cookie = self.get_secure_cookie("user")
        if not user_cookie:
            return None
        return tornado.escape.json_decode(user_cookie)

    def write_json(self, data, status=200):
        self.set_status(status)
        self.set_header("Content-Type", "application/json")
        self.write(tornado.escape.json_encode(data))