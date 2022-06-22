import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import './App.css';

function App() {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [data, setData] = useState([]);
  useEffect(async () => {
    console.log(process.env.REACT_APP_ShardIP)
    const Shardsize = await axios.post(process.env.ShardIP, {
        key: process.env.API_KEY,
     }).catch(error => {
      console.log(error);
      toast.error("Faild to get shard data!", toastOptions);
     })
      console.log(Shardsize);
      console.log(Shardsize.data.localuser);
      if(Shardsize.status == 200){
        toast.success("Successfully registered", toastOptions);
        setData(data);
      }
  }, []);
  console.log(data);

  return (
    <>
      <FormContainer>
        <div className="App">
          <div class="sidenav">
            <a>Shards:</a>
            <a>Name: </a>
            <a>Registered: </a>
          </div>
        </div>
        <div>
          <div class="main">
            <h1>Welcome to the Dashboard</h1>
          </div>
       </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #fff;
  align-items: center;
  background-color: #0b0a15;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    position: absolute;
    right: 300px;
    flex-direction: column;
    gap: 2rem;
    object-fit: cover;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  form2 {
    display: flex;
    position: absolute;
    left: 400px;
    object-fit: cover;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;


export default App;
