import React, { useEffect, useState } from 'react';
import './App.css';
import DeleteForm from './components/DeleteForm';
import MyModal from './components/MyModal';
import NoTasks from './components/NoTasks';


function App() {

  const [text, setText] = useState('')
  const [textError, setTextError] = useState('')
  const [noCompliteTasks, setNoCompliteTasks] = useState([])
  const [inputError, setInputError] = useState(false)
  const [tasks, setTasks] = useState([])
  const [hide, setHide] = useState(false)
  const [modal, setModal] = useState(false)
  const [count, setCount] = useState(tasks.length)
  const [delId, setDelId] = useState(0)

  useEffect(() => {
    try {
      const localeTasks = JSON.parse(localStorage.getItem('tasks'))
      setTasks([...localeTasks, ...tasks])
      console.log(localeTasks.filter(el => el.progress ===false))
      
      setNoCompliteTasks([...localeTasks.filter(el => el.progress ===false), ...noCompliteTasks])
    }
    catch (e) {
      console.log(e)
    }
  }, [])  //Takes an array from localeStorage if such exists

  const DeleteTask = (answer, id) => {
    if (answer === true) {
      setTasks(tasks.filter(t => t.id !== id))
      setNoCompliteTasks(noCompliteTasks.filter(t => t.id !== id))
      localStorage.clear()
      localStorage.setItem(`tasks`, JSON.stringify([...tasks.filter(t => t.id !== id)]))
      setModal(false)
    }
    else {
      setModal(false)
    }
  }  // delete task

  function handleChange(task) {
    if (tasks.find(el => el.id === task.id).progress === false) {
      tasks.find(el => el.id === task.id).progress = true
      setNoCompliteTasks(noCompliteTasks.filter(t => t.id !== task.id))
      setTasks([...tasks])
      localStorage.clear()
      localStorage.setItem(`tasks`, JSON.stringify([...tasks]))
    }
    else {
      tasks.find(el => el.id === task.id).progress = false
      setNoCompliteTasks([tasks.find(el => el.id === task.id), ...noCompliteTasks])
      setTasks([...tasks])
      localStorage.clear()
      localStorage.setItem(`tasks`, JSON.stringify([...tasks]))
    }
  } // change task progress and save new tasks array in localStorage

  const Hide = () => {
    setHide(!hide)
  } //hide complited tasks
  const AddTask = async () => {
    const newTask = {
      id: tasks.length === 0 ? tasks.length : tasks[0].id + 1,
      index: tasks.length,
      progress: false,
      text: text
    }
    if (text.length <= 54 && text.length) {
      setTasks([newTask, ...tasks])
      setNoCompliteTasks([newTask, ...noCompliteTasks])
      localStorage.clear()
      localStorage.setItem(`tasks`, JSON.stringify([newTask, ...tasks]))
      setCount(count + 1)
      setText('')
    }

  } // Add new task

  const textHandler = (e) => {
    setText(e.target.value)
    if (e.target.value.length > 54) {
      setTextError("Task content can max 54 characters.")
      setInputError(true)
    }
    else {
      setTextError('')
      setInputError(false)
    }
  }  // Input validation


  return (
    <div className="App">
    {tasks.length>0
    ?<div className='hide_complited'>
        <div className='hide_checkbox'>
          <input type={"checkbox"} className='task_checkbox' onChange={Hide} />
        </div>
        <div className='hide_text'>Hide complited</div>
      </div>
    :null}
      
      <div className='app_title'>
        Task
      </div>
      <div className='input_add'>
        <div className='input_error'>
          <input onChange={e => textHandler(e)} value={text} name='text' className={inputError === false ? 'task_input' : 'task_input_error'} type={"text"} placeholder='Write here'>
          </input>
          {(textError) && <div style={{ color: 'red' }}>{textError}</div>}
        </div>
        <button className='task_add' onClick={AddTask}>
          Add
        </button>
      </div>
      {tasks.length === 0
        ? <NoTasks />
        : <div className='tasks'>
          {(hide === false ? tasks : noCompliteTasks).map(task =>
            <div>
              <div key={task.id} className={task.progress === false ? "task" : "complite_task"}>
                <div className='checkbox'>
                  <input type={"checkbox"} className='task_checkbox' onChange={() => handleChange(task)} checked={task.progress} />
                </div>
                <div className={task.progress === false ? "task_text" : "complite_task_text"}>
                  {task.text}
                </div>
                <div className='task_button'>
                  <button id='close_button' onClick={() => {
                    setModal(true)
                    setDelId(task.id)
                  }} task={task}>
                    <div className='close_icon'></div>
                  </button>
                  <MyModal visible={modal} setVisible={setModal}>
                    <DeleteForm del={DeleteTask} id={delId} />
                  </MyModal>
                </div>
              </div>
              {task.id !== tasks[tasks.length - 1].id
                ? <hr className='line' />
                : null}
            </div>
          )}
        </div>
      }


    </div>
  );
}

export default App;
