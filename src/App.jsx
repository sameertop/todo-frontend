import React from 'react'
// import Todocard from './Todocard'
import { useState } from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { SquarePen, Trash } from 'lucide-react';
import { toast } from 'react-toastify';

function App() {

  // const BACKEND_URL =  "http://localhost:8080";
  const BACKEND_URL = "https://todo-backend-06em.onrender.com"


  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);



  // pagination states
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1)


  // search state
  const [search, setSearch] = useState("")
  const searchQueryRef = useRef();




  // modal todo form data state 
  const initializeTodoForm = {
    title: "",
    description: "",
  }

  const [todoEditId, setTodoEditId] = useState(null);
  const [todoForm, setTodoForm] = useState(initializeTodoForm)


  const [isModalopen, setisModalopen] = useState(false);
  const handleCloseModal = () => {
    setisModalopen(false);
    setTodoForm(initializeTodoForm)
  }

  const handleChangeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTodoForm((prev) => ({ ...prev, [name]: value }));
  }

  const GetTodos = async () => {
    try {
      const URL = `${BACKEND_URL}/todo?search=${search}&page=${page}&limit=${limit}`
      const response = await axios.get(URL)
      const todos = response.data.todos
      const todoTotalDocument = response.data.totalDocumentcount;

      const totalPages = Math.ceil(todoTotalDocument / limit);
      setTotalpages(totalPages);

      // console.log(todos)
      setData(todos)
      setisLoading(false)
    } catch (error) {
      console.log(error);
      setError(error.message)

    }
    finally {
      setisLoading(false)
    }
  };

  // console.log(page);

  const HandlePagination = (page) => {
    setPage(page)
  }


  const HandleSearchBar = () => {
    const value = searchQueryRef.current.value;
    console.log(value, "value");
    setSearch(value)

  }

  const handleChangeLimit = (e) => {
    const value = e.target.value;
    setLimit(value)
  }


  // console.log(search, "search");

  //function for deleting todos
  const handleDelete = async (todoId) => {
    try {
      console.log(todoId);

      const response = await axios.delete(`${BACKEND_URL}/todo/${todoId}`,)
      alert("deleted succesfully");
      GetTodos();
    } catch (error) {
      console.log("error", error);

    }
  }

  //function for handleedit where user can click edit button and modal open and showimng all info about this todo id
  const handleEdit = async (todoId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/todo/${todoId}`)
      const { _id, title, description } = response.data.todos;

      setTodoEditId(_id);
      setisModalopen(true);

      setTodoForm({
        title: title,
        description: description,
      })

    } catch (error) {
      console.log("error", error);

    }
  }


  //here actual update a existing todo
  const handleUpdateTodo = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.put(`${BACKEND_URL}/todo/${todoEditId}`, todoForm);
      // console.log(response, "response");
      if (response.status === 200) {
        toast.success("updates succesfully");
        setTodoEditId(null);
        GetTodos();
        setTodoForm(initializeTodoForm);
        setisModalopen(false);
      }

    } catch (error) {
      console.log("error", error);

    }
  }


  //function for open a modal when user click on add todo button
  const handleAddtodo = (e) => {
    setisModalopen(true)
  }


  //here it is function for adding a new todo 
  const handleAddTodoForm = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(`${BACKEND_URL}/todo`, todoForm);
      if (response.status === 201) {
        toast.success("Todo Added Succesfully")
        setisModalopen(false);
        setTodoForm(initializeTodoForm);
        GetTodos();

      }
    } catch (error) {
      console.log("error", error);

    }
  }



  useEffect(() => {
    GetTodos()
  }, [page, search, limit])


  if (isLoading) {
    return <h1>Loading ....</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <div className='bg-gray-100 h-screen p-5'>


      {/* search bar */}
      <div className="flex justify-center items-center gap-10 p-5 bg-white rounded-xl shadow-md ">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-sans text-gray-800">
            My ToDo List :
          </h1>
        </div>

        <div>
          <input
            className="w-full shadow sm:w-80 px-4 hover:bg-violet-300/20 hover:text-black py-3 border border-gray-300 rounded-lg outline-none"
            type="text"
            ref={searchQueryRef}
            placeholder="Search using title..."
          />
        </div>

        <div className=''>
          <button className=' shadow px-5 cursor-pointer hover:bg-violet-300/20 py-3 border font-semibold border-gray-300 rounded-lg' onClick={HandleSearchBar}>Search</button>
        </div>

        <div>
          <button onClick={handleAddtodo} className=' shadow px-5 cursor-pointer bg-emerald-500/50 hover:bg-emerald-400/20 py-3 border font-semibold border-gray-300 rounded-lg'>Add Todo</button>
        </div>
      </div>


      {/* todos data */}
      <div className=' grid grid-cols-2 gap-5 p-2'>
        {
          data.map((todo, index) => {
            const { _id: id, title, description } = todo
            return (
              <div>
                <div className="rounded-2xl  shadow-xl  bg-white p-5 sm:p-6">
                  <div className="flex items-start gap-5">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5  cursor-pointer accent-teal-700"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl font-bold font-sans text-slate-900">
                        {title}
                      </h2>

                      <p className="mt-1 text-md leading-relaxed text-slate-800">
                        {description}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <button onClick={() => handleEdit(id)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-md font-medium text-slate-800 transition hover:bg-slate-50 cursor-pointer">
                          <SquarePen size={16} strokeWidth={1.75} />
                          Edit
                        </button>

                        <button onClick={() => handleDelete(id)} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-md font-medium text-red-600 transition hover:bg-red-100 cursor-pointer">
                          <Trash size={16} strokeWidth={1.75} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            )
          })
        }
      </div>

      <div className='flex justify-around items-center '>
        {/* pagination */}
        <div className="flex m-4 w-fit p-5">
          <div className="flex gap-5">
            {Array(totalpages)
              .fill(0)
              .map((ele, index) => {
                const pageNumber = index + 1;

                return (
                  <button
                    key={index}
                    onClick={() => HandlePagination(pageNumber)}
                    className={`border text-md font-semibold shadow-xl px-4 cursor-pointer py-2 rounded-xl transition-colors duration-200 ${page === pageNumber
                      ? " text-black border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
          </div>
        </div>

        {/* limit div */}
        <div className='flex gap-5'>
          <label htmlFor="limit" className='text-xl font-semibold'>Todo Limit Per Page</label>
          <select className='cursor-pointer' onChange={handleChangeLimit} name="limit" id="limit">
            <option value={`${limit}`}>{limit}</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>


      {/* modal */}
      <div className={`${!isModalopen && "hidden"} w-full bg-black/60 min-h-screen fixed top-0 left-0 backdrop-blur-sm`}
      >
        <section className='w-5/12 mx-auto bg-white/30 flex flex-col gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-xl'>

          <button onClick={handleCloseModal} className=' rounded-xl font-bold px-4 py-2 text-white cursor-pointer bg-red-500/80 w-fit'>X</button>

          <form onSubmit={todoEditId ? handleUpdateTodo : handleAddTodoForm} className='flex flex-col gap-6' action="">

            <div className='flex flex-col '>
              <label className='text-xl font-bold' htmlFor="title">Title</label>

              <input onChange={handleChangeInput} className='outline-none border  border-gray-500 text-black font-bold px-4 py-2 rounded' type="text" value={todoForm.title} placeholder='Enter Your Title' id='title' name='title' />
            </div>

            <div className='flex flex-col'>
              <label className='text-xl font-bold' htmlFor="description">description</label>
              <textarea onChange={handleChangeInput} className='outline-none border border-gray-500 text-black font-bold px-4 py-2 rounded' type="text" value={todoForm.description} rows={5} placeholder='Enter Your Todo ' id='' name='description'></textarea>
            </div>

            <button type='submit' className='capitalize bg-fuchsia-600/80 hover:bg-fuchsia-500/80 text-white font-semibold py-2 rounded cursor-pointer'>
              {
                todoEditId ? "Update Todo" : "Add Todo"
              }
            </button>

          </form>
        </section>
      </div>
    </div>
  )
}

export default App