import { ToastContainer, toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { VictoryPie } from "victory-pie";
import "./App.css";

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
    const shardreq = await axios
      .post(process.env.REACT_APP_ShardIP + "/api/shardsize", {
        key: process.env.REACT_APP_API_KEY,
      })
      .catch((error) => {
        console.log(error);
        toast.error("Faild to get shard data!", toastOptions);
      });
    console.log("//////////////////////////////////////");
    console.log(shardreq);
    console.log("//////////////////////////////////////");
    if (shardreq.status == 200) {
      toast.success("Successfully registered", toastOptions);
      setData(data);
    }
  }, []);
  console.log(data);
  const myData = [
    { x: "Group A", y: 900 },
    { x: "Group B", y: 400 },
    { x: "Group C", y: 300 },
  ];

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
        <div class="main">
          <form>
            <label>
              <a className="textadd">Add Data:</a> <br></br>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div class="grid-container">
          <div class="item1">1</div>
          <div class="item2">2</div>
          <div class="item3">3</div>
          <div class="item4">4</div>
          <div class="item5">5</div>
          <div class="item6">6</div>
          <div class="item7">7</div>
        </div>
      </FormContainer>
      <ToastContainer />
    </>
  );
}
const FormContainer = styled.div`
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
  background-color: #2196F3;
  padding: 10px;
}

.grid-container > div {
  background-color: #000;
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}


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
