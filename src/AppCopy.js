import React, { useEffect, useState } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Header from './components/Header';
//import data from "../public/airports.json"
import Filter from './components/Filter';

import 'bootstrap/dist/css/bootstrap.css';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function App() {
  const classes = useStyles();

  const [data, setData] = useState([]);
  const [airports, setAirports] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState({});
  const types = ["small", "medium", "large", "heliport", "closed", "inYourFavorites"];
  const [firstIndex, setFirstIndex] = useState(1);
  const [lastIndex, setLastIndex] = useState(1);

  //let currentPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  // useEffect(() => {
  //   setAirports(data);
  // }, [])

  useEffect(() => {

    getData();
  }, [])

  useEffect(() => {
    if (data.length !== 0)
      searchByFilter();
  }, [searchFilter, typeFilter])


  useEffect(() => {

    setAirports(data);
    if (airports.length !== 0){
      loadData();
    }
    
  }, [data])

  // useEffect(() => {

  //   if (airports.length !== 0) {
  //     loadData(1);
  //   }

  // }, [airports])

  useEffect(() => {
    if (data.length !== 0)
      loadData();
  }, [currentPage])

  const setAirportData = () => {
    setAirports(data);
  }

  const getData = () => {
    fetch('airports.json', {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }).then((response) => {
      return response.json();
    })
      .then((json) => {
        if (json !== undefined) {
         // setAirports(json);
          setData(json);
         // loadData(1);
        }
      })
  }

  const searchByFilter = () => {

    let finalFilteredData = [];
    let filteredData = [];

    if (searchFilter.length > 0) {

      // filter airports for searchFilter input and store in filteredData array.
      filteredData = airports.filter((airport) => airport.name.toLowerCase().includes(searchFilter.toLowerCase()))

      finalFilteredData = filterByType(filteredData);

      setAirports(finalFilteredData);
    }
    else {

      finalFilteredData = filterByType(airports);
      setAirports(finalFilteredData);
    }

  }

  /***
   *  filter data for selected types.
   */
  const filterByType = (airports) => {

    let finalFilteredData = [];
    let count = 0;

    types.forEach((type) => {

      if (typeFilter[type] === true) {
        let res = airports.filter((airport) => airport.type.toLowerCase().includes(type));

        if (res.length > 0) {
          finalFilteredData.push.apply(finalFilteredData, res);
        }
      }
      else {
        count++;
      }
    })

    // if none of type is selected.
    if (count === 6) {
      return airports;
    }
    else {
      return finalFilteredData;
    }
  }

  const calculateTotalRecords = () => {
    // totalRecords = Math.ceil(data.length / recordsPerPage);
    //setTotalRecords(totalRecords);
  }

  const loadData = () => {

    // if (airports.length !== 0) {
    let totalRecords = Math.ceil(data.length / recordsPerPage);
    if (totalRecords !== 0) {
      let currentSetData = [];
      if (currentPage < 1)
        setCurrentPage(1);
      if (currentPage > totalRecords)
        setCurrentPage(totalRecords);

      for (let i = (currentPage - 1) * recordsPerPage; i < currentPage * recordsPerPage; i++) {
        currentSetData.push(airports[i]);
      }

      setFirstIndex((currentPage - 1) * recordsPerPage);
      setLastIndex(currentPage * recordsPerPage);

     // console.log(currentSetData);
      setAirports(currentSetData);
    }
    //  }
  }

  const loadNext = () => {
    let totalRecords = Math.ceil(data.length / recordsPerPage);
    // if (currentPage <= 1)
    //   setCurrentPage(1);
    if (currentPage >= totalRecords)
      setCurrentPage(totalRecords);
    else
      setCurrentPage(currentPage + 1);
  }

  const loadPrevious = () => {
    let totalRecords = Math.ceil(data.length / recordsPerPage);
    if (currentPage <= 1)
      setCurrentPage(1);
    // else if (currentPage >= totalRecords)
    //   setCurrentPage(totalRecords);
    else
      setCurrentPage(currentPage - 1);
  }

  return (
    <>
      <Header />

      <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} setTypeFilter={setTypeFilter} />

      <TableContainer component={Paper}>
        <Table className="table table-striped" aria-label="simple table">
          <TableHead>
            <TableRow className="bgGray">
              <TableCell > Id </TableCell>
              <TableCell > Name </TableCell>
              <TableCell > ICAO </TableCell>
              <TableCell > IATA </TableCell>
              <TableCell > Elev. </TableCell>
              <TableCell > Lat. </TableCell>
              <TableCell > Long. </TableCell>
              <TableCell > Type </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {airports.map((row) => (
              <TableRow key={row.id}>
                <TableCell >{row.id}</TableCell>
                <TableCell >{row.name}</TableCell>
                <TableCell >{row.icao}</TableCell>
                <TableCell >{row.iata}</TableCell>
                <TableCell >{row.elevation}</TableCell>
                <TableCell >{row.latitude}</TableCell>
                <TableCell >{row.longitude}</TableCell>
                <TableCell >{row.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* <Pagination airports={data} setAirports={setAirports} currentPage={currentPage} setCurrentPage={setCurrentPage} /> */}
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <ArrowBackIcon onClick={loadPrevious} /> <center>Showing <b>{firstIndex}-{lastIndex}</b> of <b>{Math.ceil(data.length / recordsPerPage)} </b> results</center> <ArrowForwardIcon onClick={loadNext} />
        </div>
      </TableContainer>

    </>
  );
}

export default App;
