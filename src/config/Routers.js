import React from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router
} from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Homepage from '../pages/Homepage/Homepage';
import Login from '../pages/Login/Login';
import ManageUser from '../pages/ManageUser/ManageUser';
import ReceiptsAndExpensePerMount from '../pages/ReceiptsAndExpensePerMount/ReceiptsAndExpensePerMount';
import ReceiptsAndExpensePerYear from '../pages/ReceiptsAndExpensePerYear/ReceiptsAndExpensePerYear';
import Project from '../pages/Project/Project';
import ProjectPDF from '../pages/ProjectPDF/ProjectPDF';
import PerYearPDF from '../pages/PerYearPDF/PerYearPDF';
import PerMonthPDF from '../pages/PerMonthPDF/PerMonthPDF';
// min-height call form
// 3.25rem is all of heigth Navbar
// 1em + 51px is is all of heigth Footer

const Routers = () => (
  <div>
    <Router>
      <div>
        {/* nav bar */}
        <Navbar />
        {/* difine router */}
        {/* <div style={{ margin: '3.25rem 0em 0em 0em', minHeight: 'calc(100vh - 3.25rem - 1em  - 61px)', display: 'flex' }}> */}
        <div style={{ margin: '4.25rem 0em 0em 0em', minHeight: 'calc(100vh - 3.25rem)' }}>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route path="/manage-users" component={ManageUser} />
            <Route path="/login" component={Login} />
            <Route path="/receipts-and-expense-per-month" component={ReceiptsAndExpensePerMount}/>
            <Route path="/receipts-and-expense-per-year" component={ReceiptsAndExpensePerYear} />
            <Route path="/projects" component={Project} />
            <Route path="/project-preview" component={ProjectPDF} />
            <Route path="/per-year-preview" component={PerYearPDF} /> 
            <Route path="/per-month-preview" component={PerMonthPDF} /> 
          </Switch>
        </div>
        {/* <Footer /> */}
      </div>
    </Router>
  </div>
);

export default Routers;