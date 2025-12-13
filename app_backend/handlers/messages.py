import tornado.escape
import datetime
from bson import ObjectId
from app_backend.db import messages, users, BaseHandler

class MessagesHandler(BaseHandler):
    async def get(self):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        cursor = messages.find({})
        out = []

        async for t in cursor:
            author = await users.find_one(
                {"_id": t["user_id"]},
                {"email": 1}
            )

            out.append({
                "id": str(t["_id"]),
                "text": t["text"],
                "email": author["email"] if author else "unknown",
                "time": t["time"],
                "can_delete": str(t["user_id"]) == user["id"]
            })

        return self.write_json({"items": out})


    async def post(self):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        dataOra = datetime.datetime.now()
        current_date_time = dataOra.strftime("%m/%d/%Y, %H:%M")

        body = tornado.escape.json_decode(self.request.body)
        text = body.get("text", "").strip()

        if not text:
            return self.write_json({"error": "Testo obbligatorio"}, 400)

        result = await messages.insert_one({
            "user_id": ObjectId(user["id"]),
            "text": text,
            "time": current_date_time,
        })

        return self.write_json({"id": str(result.inserted_id)}, 201)

class MessageDeleteHandler(BaseHandler):
    async def delete(self, task_id):
        user = self.get_current_user()
        if not user:
            return self.write_json({"error": "Non autenticato"}, 401)

        await messages.delete_one({
            "_id": ObjectId(task_id),
            "user_id": ObjectId(user["id"])
        })

        return self.write_json({"message": "Eliminato"})