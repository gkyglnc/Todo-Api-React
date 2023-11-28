import { FaCheck, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import './App.css';

function App() {
  const [showCompleted, setShowCompleted] = useState(null);
  const [apidata, setApidata] = useState([]);
  const [newTodo, setNewTodo] = useState({
    name: '',
    title: '',
    completed: false,
    userid: '',
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
          userid: '',
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

  const completedPercentage = () => {
    const totalCount = apidata.length;
    const completedCount = apidata.filter((todo) => todo.completed).length;
    return (completedCount / totalCount) * 100;
  };

  const uncompletedPercentage = () => {
    const totalCount = apidata.length;
    const uncompletedCount = apidata.filter((todo) => !todo.completed).length;
    return (uncompletedCount / totalCount) * 100;
  };

  const filteredData = apidata.filter((todo) => {
    if (showCompleted === null) {
      return true;
    } else {
      return todo.completed === showCompleted;
    }
  });
 console.log(apidata)
  return (
    <>
      <div className="app">
        <div className="container">
          <div className="app1">
            <div className="board">
              <div className="progres-bar-div">
                <CircularProgressbar
                  value={completedPercentage()}
                  text={`${completedPercentage().toFixed(2)}%`}
                  className="progres-bar"
                />
              </div>
              <div className="progres-bar-div">
                <CircularProgressbar
                  value={uncompletedPercentage()}
                  text={`${uncompletedPercentage().toFixed(2)}%`}
                  className="progres-bar"
                />
              </div>
            </div>
            <div className="text-div">
              <div className="progres-bar-text">
                <p>Work Done</p>
              </div>
              <div className="progres-bar-text">
                <p>Remaining work</p>
              </div>
            </div>
            <div className="space-border"></div>
            <div className="true-false-list-div">
              <div className='true-false-filter-btn'>
              <button className={`true-list ${showCompleted === true ? 'active' : ''}`}
                onClick={() => setShowCompleted(true)}>True</button>
              <button className={`false-list ${showCompleted === false ? 'active' : ''}`}
                onClick={() => setShowCompleted(false)}>False</button>

              </div>
              <div className='list-1'>
              {filteredData.map((todo , i) =>(
              <ul>
                <li key={i}>
                  <p className='p1'>{todo.name}</p>
                  <p className='p2'>{todo.title}</p>
                </li>
              </ul>
              ))}
              </div>
            </div> 


            
          </div>

          <div className="app2">
            <div className="app2-input-div">
              <form onSubmit={handleSubmit}>
                <div className="input12-div">
                  <input
                    className="input1"
                    type="text"
                    name="name"
                    value={newTodo.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <input
                    className="input2"
                    type="text"
                    name="userid"
                    value={newTodo.userid}
                    onChange={handleChange}
                    placeholder="userID"
                  />
                </div>
                <div className="input3-button-div">
                  <input
                    className="input3"
                    type="text"
                    name="title"
                    value={newTodo.title}
                    onChange={handleChange}
                    placeholder="title..."
                  />
                  <button type="submit" className="button-add">
                    Add
                  </button>
                </div>
              </form>
            </div>
            <div className="list">
              {apidata.map((todo, i) => (
                <ul key={i}>
                  <li>
                    <p className='p1'>
                      {todo.name} 
                    </p>
                    <p className='p2-2'>
                      {todo.title}{' '}
                    </p>
                    <FaCheck
                      onClick={() => handleCompleteToggle(todo.id)}
                      className={`check-icon ${todo.completed ? 'completed' : ''}`}
                    />
                    <FaTrash onClick={() => handleDelete(todo.id)} className="trash-icon" />
                  </li>
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
