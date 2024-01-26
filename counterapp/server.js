const express = require("express");
const redis = require("redis");

const app = express();

const PORT = process.env.PORT || 3002;
const REDIS_URL = process.env.REDIS_URL || "localhost";

const client = redis.createClient({url: REDIS_URL});

( async () => {
    await client.connect()
} ) ();


app.post('/counter/:bookId/incr', async(req, res) => {
    
    const { bookId } = req.params; 
    try {
        const cnt = await client.incr(bookId);
        res.status(200);
        res.json({message: `${bookId}`, cnt});
    } catch (e) {
        res.json({errcode: 500, errmsg: `Ошибка counter ${e}`});
    }
});

app.get("/counter/:bookId", async (req, res) => {

    const { bookId } = req.params;
    try {
        const cnt = await client.get(bookId);
        res.status(200);
        res.json({message: `${bookId}`, cnt});
    } catch (e) {
        res.json({ errcode: 500, errmsg: `Ошибка counter ${e}`});
    }
});

app.listen(PORT, () => {
    console.log(`Counter запущен на порту ${PORT}`)
})