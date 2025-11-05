import express from 'express';
import "dotenv/config"
import cors from 'cors';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js';
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8080;

app.use("/api",chatRouter);

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
    connectDb();
})

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    }catch(e)
    {
        console.log("Error connecting to database",e);
    }
}

// app.post("/test",async(req,res) =>{
//     const options = {
//         method:"POST",
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages:[{
//                 role:"user",
//                 content: req.body.message
//             }]
//         })

//     }
// try{
//    const response = await fetch("https://api.openai.com/v1/chat/completions",options)
//    const data = await response.json();
//    console.log(data.choices[0].message.content);
//    res.send(data.choices[0].message.content);
// }catch(e){
//     console.log(e);
// }
// })