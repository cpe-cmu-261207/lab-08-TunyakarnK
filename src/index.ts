import express, { Request } from 'express'
import { type } from 'os';

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

let id = 0;
type Task = {
  id: number;
  name: string;
  complete: boolean;
}
const tasks: Task[] = []

//GET/ME
app.get('/me', (req, res) => {
  return res.status(200).json({ name: 'Tunyakarn Kitchon', code: '630610740', })
})

//GET/todo
app.get('/todo', (req, res) => {
  // try to call /todo?q1=data1&q2data2
  // you can read query parameters with "req.query"

  //sort
  if (req.query.order == "asc") {
    tasks.sort((a, b) => {
      let A = a.name.toLowerCase(), B = b.name.toLowerCase();

      if (A > B){
        return 1;
      }if (A < B){
        return -1;
        }
        return 0; 
    })
  }else if (req.query.order == "desc") {
    tasks.sort((a, b) => {
      let A = a.name.toLowerCase(), B = b.name.toLowerCase();

      if (A > B) 
        return -1;
      if (A < B)
        return 1;
      return 0; 
    })
  }
  return res.json({ status: 'success', tasks })
})

//POST/todo
app.post('/todo', (req, res) => {

  const newTask: Task = {
    id: id + 1,
    name: req.body.name,
    complete: req.body.complete
  }

  if (typeof (newTask.name) !== "string" || newTask.name === "" || typeof (newTask.complete) !== "boolean") {
    return res.status(400).json({ status: "failed", message: "Invalid input data" })
  }else{
    id = id+1
    tasks.push(newTask)
    return res.status(200).json({ status: 'success', tasks })
  }
})

//PUT/todo/:id
app.put('/todo/:id', (req, res) => {

  let tagID = parseInt(req.params.id)
  let tag = tasks.findIndex(x => x.id == tagID)

  if (tag > -1) {
    tasks[tag].complete = !tasks[tag].complete
    return res.status(200).json({ status: "succes", task:{id:tasks[tag].id,name:tasks[tag].name,complete:tasks[tag].complete} })
  }else{
    return res.status(404).json({ status: "failed", message: "Id is not found" })
  }
})

//DELETE/todo/:id
app.delete('/todo/:id',(req,resp)=>{
  
  const id = parseInt(req.params.id)
  const deleteID = tasks.findIndex(x=>x.id===id)

  if(deleteID>-1)
  {
   tasks.splice(deleteID,1)
  return resp.json({status:"succes",tasks})
  }
  else
  {
      return resp.status(400).json({status:"failed",message:"Id is not found"})
  }
})

//Heroku will set process.env.PORT to server port
//But if this code run locally, port will be 3000
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server is running at port' + port)
}
)