import React from 'react';
import { FiUser } from 'react-icons/fi'
import './App.css';
import Search from './components/Search/Search';
import CityChart from './components/Chart/CityChart'

const App = () => {
  return (
    <div className="container">
      <Search />
      <div className="row">
        <div className="col-lg-3">
          <div className="stat-card ">
            <div>
              <p className="card-heading"> Total Volunteer</p>
              <p className="stat">158</p>
            </div>
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="stat-card ">
            <div>
              <p className="card-heading"> Active Volunteer</p>
              <p className="stat">158</p>
            </div>
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="stat-card ">
            <div>
              <p className="card-heading"> Inactive Volunteer</p>
              <p className="stat">158</p>
            </div>
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="stat-card ">
            <div>
              <p className="card-heading"> Total Volunteer</p>
              <p className="stat">158</p>
            </div>
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

      </div>
      <CityChart />

    </div>
  );
}

export default App;
