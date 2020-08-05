import React, { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import './App.css';
import Search from './components/Search/Search';
import CityChart from './components/Chart/CityChart';
import { useQuery } from '@apollo/client';
import { STATS_QUERY, ALL_STAT } from './query';
import Lottie from 'react-lottie';
import MonthlyChart from './components/Chart/MonthlyChart';
import { OverallStat } from './components/schema';
import MonthlyEventChart from './components/Chart/MonthlyEventChart';

const App = () => {


  let BASE_URL = 'https://app.zohocreator.in/deepak64/bloodconnect-india-donor-system'
  if (!window.location.href.includes('localhost')) {
    BASE_URL = window.location.origin + window.location.pathname
  }

  let citiesData = [
    { city: 'Delhi NCR', donations: 0, label: 0 },
    { city: 'Agra', donations: 0, label: 0 },
    { city: 'Lucknow', donations: 0, label: 0 },
    { city: 'Jaipur', donations: 0, label: 0 },
    { city: 'Kolkata', donations: 0, label: 0 },
    { city: 'Ranchi', donations: 0, label: 0 },
    { city: 'Odisha', donations: 0, label: 0 },
    { city: 'Varanasi', donations: 0, label: 0 },
    { city: 'Pune', donations: 0, label: 0 },
    { city: 'Kanpur', donations: 0, label: 0 },
    { city: 'Consulting', donations: 0, label: 0 }
  ]

  const [city, setCity] = useState('All')
  //const { data, loading } = useQuery(STATS_QUERY, { variables: { city } })
  const [cd, setCitiesData] = useState(citiesData)
  const { data, loading } = useQuery(ALL_STAT)
  const [isLoading, setLoading] = useState(true)
  const [aV, setAV] = useState(-1)
  const [camps, setCamps] = useState(-1)
  const [awareness, setAwareness] = useState(-1)
  const [donations, setDonations] = useState(-1)

  // Monthly Datas
  // Donations data
  const [monthlyData, setmonthlyData] = useState(Array(12).fill(0))
  // Camp data
  const [monthlyCampData, setmonthlyCampData] = useState(Array(12).fill(0))
  // Awareness data
  const [monthlyAwarenessData, setmonthlyAwarenessData] = useState(Array(12).fill(0))
  const [aVUrl, setaVUrl] = useState(`${BASE_URL}/#Report:BloodConnect_Team_Report?Status=Active`)

  const setCityChartData = (d: OverallStat[]) => {
    d.forEach(da => {
      let i = citiesData.findIndex(c => c.city === da.city)
      if (i < 0)
        return
      citiesData[i].donations = da.stat.donations
      citiesData[i].label = da.stat.donations
    })

    setCitiesData(citiesData)
  }

  useEffect(() => {
    if (!loading && data && data.overallStat) {
      setLoading(false)
      setCityChartData(data.overallStat)
      let curr = data.overallStat.find((a: OverallStat) => a.city === city)
      //console.log(curr)
      setAV(curr.stat.activeVolunteer)
      setCamps(curr.stat.camps)
      setAwareness(curr.stat.awareness)
      setDonations(curr.stat.donations)
      setmonthlyData(curr.stat.monthwiseDonation)
      setmonthlyCampData(curr.stat.monthCampData)
      setmonthlyAwarenessData(curr.stat.monthAwarnessData)
    }
  }, [data, loading, city])
  const setSearch = (c: string): void => {
    if (c !== city) {
      setLoading(true)
      setCity(c)
    }

  }

  useEffect(() => {
    if (city !== 'All')
      setaVUrl(`${BASE_URL}/#Report:BloodConnect_Team_Report?Status=Active&&BloodConnect_City=${city}`)
  }, [BASE_URL, city])

  const Loading = () => {
    return (
      <div>
        <Lottie
          options={{
            animationData: require('./assets/animation/loading.json'),
            loop: true,
            autoplay: true
          }}
          height={100}
          width={100}
          isStopped={!isLoading}
        />
      </div>
    )
  }
  return (
    <div className="container">
      <div className="row justify-content-between ">
        <h4 className="stat col-lg-4 col-sm-12  mt-2 d-flex align-items-center justify-content-center">{city === 'All' ? 'BloodConnect' : city}</h4>
        <Search handleChange={setSearch} />
      </div>
      <div className="row">
        <div className="col-lg-3">
          <div className="stat-card " onClick={() => {
            window.open(aVUrl, '_blank')
          }}>
            {
              aV >= 0 && !isLoading ?
                <div>
                  <p className="card-heading"> Active Volunteer</p>
                  <p className="display-4">{aV}</p>
                </div>
                : <Loading />
            }
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="stat-card ">
            {
              camps >= 0 && !isLoading ?
                <div>
                  <p className="card-heading"> Camps</p>
                  <p className="display-4">{camps}</p>
                </div>
                : <Loading />
            }
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="stat-card ">
            {
              awareness >= 0 && !isLoading ?
                <div>
                  <p className="card-heading"> Awareness</p>
                  <p className="display-4">{awareness}</p>
                </div>
                : <Loading />
            }
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="stat-card ">
            {
              donations >= 0 && !isLoading ?
                <div>
                  <p className="card-heading"> Toatal Donation </p>
                  <p className="display-4">{donations}</p>
                </div>
                : <Loading />
            }
            <div className="stat-icon-container">
              <FiUser size={34} />
            </div>
          </div>
        </div>

      </div>
      {
        city === 'All' ?
          <CityChart data={cd} setSearch={setSearch} />
          : <></>
      }
      <MonthlyChart data={monthlyData} loading={isLoading} />
      <MonthlyEventChart camp={monthlyCampData} awareness={monthlyAwarenessData} />
    </div>
  );
}

export default App;
