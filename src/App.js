
import { useEffect, useRef, useState } from "react";
import uuid from "react-uuid";
import styled from "styled-components";
import ListItem from "./Components/ListItem";
import { useThemeContext } from "./context/themeContext";
import { myTodos } from "./data/todos";
import {DndContext} from '@dnd-kit/core'
import {SortableContext} from '@dnd-kit/sortable'
import gsap from "gsap";
import { removeFromLocalStorage, savetoLocalStorage } from "./utils/localStorage";

const grid = <i className="fa-solid fa-table-columns"></i> 
const list = <i className="fa-solid fa-list-check"></i>

function App() {
  const theme = useThemeContext()

  //refs
  const todosRef = useRef()
  const todosCon = useRef()
  const formRef = useRef()

  //state
  const [todos, setTodos] = useState(myTodos)
  const [value, setValue] = useState('')
  const [toggleGrid, settoggleGrid] = useState(false)

  //get from local storage
  useEffect(() => {
    const localTodos = localStorage.getItem('newTodos')
    if(localTodos){
      setTodos(JSON.parse(localTodos))
    }

    //grid from local storage
    const localGrid= localStorage.getItem('gridToggle')
    if(localGrid){
      settoggleGrid(JSON.parse(localGrid))
    }
  }, [])

  
  //handle change
  const handleChange = (e) => {
    setValue(e.target.value)
  }
  

  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    //validations
    if(!value || value.length < 3){
      alert('Todo must be at least 3 characters long')
    }

    const newTodo = [...todos, {id: uuid(), name:value, completed:false}]
    setTodos(newTodo)
    savetoLocalStorage(newTodo)
    setValue('')
  }

  //handle remove
  const removeTodo = (id) => {
    removeFromLocalStorage(id, todos)
    const filtered = todos.filter((todo) => {
      return todo.id !== id
    })

    setTodos(filtered)
  }

  //toggle grid
  const gridHandler = () => {
    settoggleGrid(!toggleGrid)
    localStorage.setItem('gridToggle', JSON.stringify(!toggleGrid))
  }

  //handle complete
  const handleComplete = (id) => {
    const newTodos = todos.map((todo) => {
      if(todo.id === id) {
        todo.completed = !todo.completed
      }

      return todo
    })
    setTodos(newTodos)
    savetoLocalStorage(newTodos)
  }

  //on drag end
  const handleDragEnd = (event) => {
    const {active, over} = event

    if(!active.id !== over.id){
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        //create a new array with the new order
        const newTodos = [...items]
        //remove the item from the old index
        newTodos.splice(oldIndex, 1)
        //insert the item at the new index
        newTodos.splice(newIndex, 0, items[oldIndex])

        //save to local storage
        savetoLocalStorage(newTodos)

        //return new todos
        return newTodos;
      })
    }
  }


  //animate on initial render
  useEffect(() => {
    const tl = gsap.timeline({defaults: {duration: 1, ease: 'power1.out'}})

    tl.fromTo(todosRef.current, 
      {opacity: 0, x: 800},
      {opacity: 1, x: 0, duration: 0.5})

      .fromTo(todosCon.current,
        {opacity: 0, y: 800, scale: 0.5 },
        {opacity: 1, y: 0, scale: 1, duration: 0.5}, '-0.1')

      .fromTo(formRef.current,
        { opacity: 0, y: -800, scaleX: 0},
        { opacity: 1, y: 0, scaleX: 1}, '-0.3')
    
  }, []);

  return (
    <AppStyled theme={theme} grid={toggleGrid}>
      <form ref={formRef} action="" className="form" onSubmit={handleSubmit}>
        <h1>Today's Tasks</h1>
        <div className="input-container">
          <input type="text" placeholder="Add a Task" value={value} onChange={handleChange} />
          <div className="submit-con">
            <button>+ Add Todo</button>
          </div>
        </div>
      </form>
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((todo) => todo.id)}>
          <ul className="todos-con" ref={todosCon}>
            <div className="priority-con">
              <p>Priority</p>
              <div className="toggle-grid">
                <button onClick={gridHandler}>
                  {toggleGrid ? grid : list}
                </button>
              </div>
              <p>High</p>
            </div>
            <div className="todos" ref={todosRef}>
              {
                todos.map((todo) => {
                  const {id, name, completed} = todo
                  return <ListItem 
                    key={id} 
                    name={name}
                    id={id}
                    completed={completed}
                    removeTodo={removeTodo}
                    grid={toggleGrid}
                    handleComplete={handleComplete}
                  />
                })
              }
            </div>
            <div className="low-priority">
              <p>
                Low
              </p>
            </div>
          </ul>
        </SortableContext>
      </DndContext>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  padding: 5rem 25rem;
  background-color: ${(props) => props.theme.colorBg3};
  @media screen and (max-width: 1490px){
    padding: 5rem 15rem;
  }
  @media screen and (max-width: 400px){
    padding: 2rem;
  }
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color:${(props) => props.theme.colorBg2};
    border-radius: 1rem;
    margin-bottom: 2rem;
    padding: 2rem 1rem;
    box-shadow:  ${(props) => props.theme.shadow3};
    border: 1px solid ${props => props.theme.colorIcons3};
    h1{
      font-size: clamp(1.5rem, 2vw, 2.5rem);
      font-weight: 800;
      color: ${(props) => props.theme.colorPrimaryGreen}; 
    }
    .input-container{
      margin: 2rem 0;
      position: relative;
      font-size: clamp(1rem, 2vw, 1.2rem);
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      @media screen and (max-width: 400px){
        width: 90%;
      }
      input, button{
        font-family: inherit;
        font-size: clamp(1rem, 2vw, 1.2rem);
      }
      input{
        background: transparent;
        border:1px solid ${(props) => props.theme.colorIcons3};
        border-radius: 7px;
        padding: .8rem 1rem;
        color: ${(props) => props.theme.colorGrey2};
        width: 100%;
        &:focus{
          outline: none;
        }
        &::placeholder{
          color: ${(props) => props.theme.colorGrey3};
        }
        &:active, &:focus{
          border: 1px solid ${(props) => props.theme.colorIcons};
        }
      }
      button{
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        border: none;
        background: ${(props) => props.theme.colorPrimaryGreen};
        height: 100%;
        padding: 0 1rem;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        color: ${(props) => props.theme.colorWhite};
        transition: all .3s ease;
        &:hover{
          background: ${(props) => props.theme.colorPrimary2};
        }
      }
    }
  }

  .todos-con{
    overflow: hidden;
    background: ${(props) => props.theme.colorBg2};
    padding: 5rem;
    border-radius: 1rem;
    box-shadow: ${(props) => props.theme.shadow3};
    border: 1px solid ${props => props.theme.colorIcons3};
    @media screen and (max-width: 400px){
      padding: 1rem;
    }
    .todos{
      display: ${props => props.grid ? 'grid' : ''};
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      grid-column-gap: 1rem;
      grid-row-gap: ${props => props.grid ? '1rem' : ''};
    }
    .priority-con{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      p{
        font-size: clamp(1rem, 2vw, 1.2rem);
        font-weight: 600;
        color: ${(props) => props.theme.colorGrey2};
        &:last-child{
          color: ${(props) => props.theme.colorDanger};
        }
      }
      .toggle-grid{
        button{
          padding: .5rem 1rem;
          border-radius: 7px;
          background: ${(props) => props.theme.buttonGradient11};
          border: 1px solid ${(props) => props.theme.colorIcons3};
          cursor: pointer;
          font-size: clamp(1rem, 2vw, 1.6rem);
          color: ${(props) => props.theme.colorGrey1};
          transition: all .3s ease-in-out;
        }
      }
    }

    .low-priority{
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      p{
        font-size: clamp(1rem, 2vw, 1.2rem);
        font-weight: 600;
        background-clip: text;
        background: ${(props) => props.theme.colorPrimaryGreenGrad};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
`;

export default App;
