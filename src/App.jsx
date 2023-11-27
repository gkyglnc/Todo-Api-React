import { FaCheck , FaTrash } from "react-icons/fa";
import { useState , useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [apidata, setApidata] = useState([]);
  const [newTodo, setNewTodo] = useState({
    name: '',
    title: '',
    completed: false,
    userid:''
  });

  const baseURL = 'https://656251d2dcd355c08324c42c.mockapi.io/x';

  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setApidata(response.data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();



    axios
      .post(baseURL, newTodo)
      .then((response) => {
        setApidata([...apidata, response.data]);
        setNewTodo({
          name: '',
          title: '',
          completed: false,
          userid:''
        });
      })
      .catch((error) => {
        console.error('Todo eklerken hata oluştu:', error);
      });
  };

  const handleCompleteToggle = (todoId) => {

    const updatedData = apidata.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );

    axios
      .put(`${baseURL}/${todoId}`, updatedData.find((todo) => todo.id === todoId))
      .then((response) => {
        setApidata(updatedData);
      })
      .catch((error) => {
        console.error('Todo güncellenirken hata oluştu:', error);
      });
    };


    const handleDelete = (todoId) => {
      axios
        .delete(`${baseURL}/${todoId}`)
        .then((response) => {
          const updatedData = apidata.filter((todo) => todo.id !== todoId);
          setApidata(updatedData);
        })
        .catch((error) => {
          console.error('Todo silinirken hata oluştu:', error);
        });
    };



  console.log(apidata)
  return (

  <>
    <div className="app">
      <div className="container">
        <div className="app1">

        <div className="board"></div>



        </div>

        <div className="app2">
          
          <div className="app2-input-div">
            <form onSubmit={handleSubmit}>
              <div className='input12-div'>

                <input
                className='input1'
                type="text" 
                name="name"
                value={newTodo.name}
                onChange={handleChange}
                placeholder='Name'

                />

                <input 
                className='input2' 
                type="text" 
                name="userid"
                value={newTodo.userid}
                onChange={handleChange}
                placeholder='userID'/>
                
              </div>

              <div className="input3-button-div">
                <input 
                className='input3' 
                type="text" 
                name="title"
                value={newTodo.title}
                onChange={handleChange}
                placeholder='title...'/>
                <button  type="sumbit" className='button-add'>Add</button>
              </div>
            </form> 
          </div>

            <div className="list">
              {apidata.map((todo, i)=> (
              <ul>
                <li key={i}><p>{todo.name} | {todo.title} </p><FaCheck onClick={() => handleCompleteToggle(todo.id)} className={`check-icon ${todo.completed ? 'completed' : ''}`}/><FaTrash onClick={() => handleDelete(todo.id)} className="trash-icon"/></li>
              </ul>
              ))}
            </div>

        </div>

      </div>
    </div>

  </>
  );
}

export default App;
