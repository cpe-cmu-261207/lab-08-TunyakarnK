import express, { Request } from 'express'
import { register } from 'ts-node';

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

type Task = {
  id: number;
  name: string;
  complete: boolean;
}

const tasks: Task[] = []

let currID: number = 1

//GET/ME
app.get('/me', (req, res) => {
  return res.json({ name: 'Tunyakarn Kitchon', code: '630610740'})
})

//GET/todo
app.get('/todo', (req, res) => {
  if(req.query.order == "asc") {
    tasks.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
  })
  }else if(req.query.order == "desc"){
    tasks.sort(function(a, b){
      if(a.name > b.name) { return -1; }
      if(a.name < b.name) { return 1; }
      return 0;
  })
  }
  return res.json({ status: 'success', tasks })
})

//POST/todo
app.post('/todo', (req, res) => {
if(typeof req.body.name !== 'string' || req.body.name === "" || typeof req.body.complete !== 'boolean'){
    return res.status(400).json({ status: 'failed', message: 'Invalid input data' })
  }else{
    tasks.push({
      id: currID,
      name: req.body.name,
      complete: req.body.complete
    })
    currID +=1
    return res.json({ status: 'success', tasks: tasks })
  }
  
})

//PUT/todo/:id
app.put('/todo/:id', (req, res) => {
  const tagID = parseInt(req.params.id)
  const tag = tasks.find(x => x.id === tagID)

  if (tag) {
    tag.complete = !tag.complete
    return res.status(200).json({ status: "success", task: tag})
  }else{
    return res.status(404).json({ status: "failed", message: "Id is not found" })
  }
})

//DELETE/todo/:id
app.delete('/todo/:id',(req,resp)=>{
  const id = parseInt(req.params.id)
  const foundIndex = tasks.findIndex(x=>x.id===id)

  if(foundIndex>-1)
  {
   tasks.splice(foundIndex,1)
  return resp.json({status:"success",tasks})
  }
  else
  {
      return resp.status(400).json({status:"failed",message:"Id is not found"})
  }
})

//Heroku will set process.env.PORT to server port
//But if this code run locally, port will be 3000
const port = process.env.PORT || 3100
app.listen(port, () => {
  console.log('Server is running at port' + port)
}
)