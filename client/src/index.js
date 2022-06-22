import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";
import './index.css';
/////////////////////////////////////////////////////////////
import Home from './App';
/////////////////////////////////////////////////////////////
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);


reportWebVitals();