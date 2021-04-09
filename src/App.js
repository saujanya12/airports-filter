import React from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Header from './components/Header';
import Filter from './components/Filter';

import 'bootstrap/dist/css/bootstrap.css';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      airports: [],
      searchFilter: '',
      typeFilter: {},
      types: ["small", "medium", "large", "heliport", "closed", "inYourFavorites"],
      firstIndex: 1,
      lastIndex: 1,
      currentPage: 1,
      recordsPerPage: 4,
      filteredData: []
    }

    this.loadData = this.loadData.bind(this);
    this.getData = this.getData.bind(this);
    this.filterByType = this.filterByType.bind(this);
    this.searchByFilter = this.searchByFilter.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
    this.setSearchFilter = this.setSearchFilter.bind(this);
    this.setTypeFilter = this.setTypeFilter.bind(this);
    this.loadDataFirst = this.loadDataFirst.bind(this);

  }

  componentDidMount() {

    this.getData();
  }

  getData = () => {
    fetch('airports.json', {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }).then((response) => {
      return response.json();
    })
      .then((json) => {
        if (json !== undefined) {

          this.setState({
            data: json
          }, this.loadDataFirst)
        }
      })
  }

  setSearchFilter = (input) => {

    this.setState({
      searchFilter: input
    }, this.searchByFilter)
  }

  setTypeFilter = (input) => {

    this.setState({
      typeFilter: input
    }, this.searchByFilter)
  }

  searchByFilter = () => {

    let finalFilteredData = [];
    let filteredData = [];

    if (this.state.searchFilter.length > 0) {

      // filter airports for searchFilter input and store in filteredData array.
      filteredData = this.state.data.filter((airport) => Object.values(airport).join(" ").toLowerCase().includes(this.state.searchFilter.toLowerCase()))

      finalFilteredData = this.filterByType(filteredData);

      this.setState({
        filteredData: finalFilteredData,
      }, this.loadData)
    }
    else {

      finalFilteredData = this.filterByType(this.state.data);
      this.setState({
        filteredData: finalFilteredData,
      }, this.loadData)
    }
  }

  /***
   *  filter data for selected types.
   */
  filterByType = (airport) => {

    let finalFilteredData = [];
    let count = 0;

    this.state.types.forEach((type) => {

      if (this.state.typeFilter[type] === true) {
        let res = airport.filter((d) => d.type.toLowerCase().includes(type));

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
      return airport;
    }
    else {
      return finalFilteredData;
    }
  }

  loadDataFirst = () => {

    let totalRecords = Math.ceil(this.state.data.length / this.state.recordsPerPage);
    if (totalRecords !== 0) {

      let currentSetData = [];
      if (this.state.currentPage < 1) {

        this.setState({
          currentPage: 1
        })
      }

      if (this.state.currentPage > this.state.totalRecords) {

        this.setState({
          currentPage: totalRecords
        })
      }

      for (let i = (this.state.currentPage - 1) * this.state.recordsPerPage; i < this.state.currentPage * this.state.recordsPerPage; i++) {
        currentSetData.push(this.state.data[i]);
      }

      this.setState({
        firstIndex: (this.state.currentPage - 1) * this.state.recordsPerPage + 1
      })

      this.setState({
        lastIndex: this.state.currentPage * this.state.recordsPerPage > this.state.data.length ? this.state.data.length : this.state.currentPage * this.state.recordsPerPage
      })

      this.setState({
        airports: currentSetData
      })
    }
  }

  loadData = () => {

    let page = this.state.currentPage;
    let totalRecords = this.state.filteredData.length > 0 ?
      Math.ceil(this.state.filteredData.length / this.state.recordsPerPage)
      :
      Math.ceil(this.state.data.length / this.state.recordsPerPage)

    if (totalRecords !== 0) {

      let currentSetData = [];
      if (this.state.currentPage < 1) {
        page = 1;
      }

      if (this.state.currentPage > totalRecords) {
        page = totalRecords;
      }

      if (this.state.filteredData.length > 0) {
        for (let i = (page - 1) * this.state.recordsPerPage; i < page * this.state.recordsPerPage; i++) {
          if (this.state.filteredData[i] !== undefined) {
            currentSetData.push(this.state.filteredData[i]);
          }
        }
      }

      this.setState({
        firstIndex: ((page - 1) * this.state.recordsPerPage + 1)
      })

      this.setState({
        lastIndex: (page * this.state.recordsPerPage) > this.state.filteredData.length ? this.state.filteredData.length : (page * this.state.recordsPerPage)
      })

      this.setState({

        airports: currentSetData
      })
    }
    // }
  }

  loadNext = () => {

    let totalRecords = Math.ceil(this.state.filteredData.length > 0 ? this.state.filteredData.length : this.state.data.length / this.state.recordsPerPage);
    if (this.state.currentPage >= totalRecords) {
      //setCurrentPage(totalRecords);
      this.setState({
        currentPage: totalRecords
      },()=>{
        this.state.filteredData.length > 0 ?
        this.loadData()
        :
        this.loadDataFirst()
      })
    }
    else {

      this.setState({
        currentPage: this.state.currentPage + 1
      },()=>{
        this.state.filteredData.length > 0 ?
        this.loadData()
        :
        this.loadDataFirst()
      })
    }
  }

  loadPrevious = () => {
    let totalRecords = Math.ceil(this.state.data.length / this.state.recordsPerPage);
    if (this.state.currentPage <= 1) {

      this.setState({
        currentPage: 1
      },()=>{
        this.state.filteredData.length > 0 ?
        this.loadData()
        :
        this.loadDataFirst()
      })
    }
    else if (this.state.currentPage >= totalRecords) {

      this.setState({
        currentPage: totalRecords
      },()=>{
        this.state.filteredData.length > 0 ?
        this.loadData()
        :
        this.loadDataFirst()
      })
    }
    else {

      this.setState({
        currentPage: this.state.currentPage - 1
      },()=>{
        this.state.filteredData.length > 0 ?
        this.loadData()
        :
        this.loadDataFirst()
      })
    }
  }

  render() {
    return (
      <>
        <Header />

        <Filter searchFilter={this.state.searchFilter} setSearchFilter={this.setSearchFilter} setTypeFilter={this.setTypeFilter} />

        <TableContainer component={Paper}>
          <Table className="table table-striped" aria-label="simple table">
            <TableHead>
              <TableRow className="bgGray">
                {/* <TableCell ><b> Id</b> </TableCell> */}
                <TableCell ><b> Name </b></TableCell>
                <TableCell ><b> ICAO </b></TableCell>
                <TableCell ><b> IATA </b></TableCell>
                <TableCell ><b> Elev. </b></TableCell>
                <TableCell ><b> Lat. </b></TableCell>
                <TableCell ><b> Long. </b></TableCell>
                <TableCell ><b> Type </b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.airports.length > 0 ? this.state.airports.map((row) => (
                <TableRow key={row.id}>
                  {/* <TableCell >{row.id}</TableCell> */}
                  <TableCell >{row.name}</TableCell>
                  <TableCell >{row.icao}</TableCell>
                  <TableCell >{row.iata}</TableCell>
                  <TableCell >{row.elevation}</TableCell>
                  <TableCell >{row.latitude}</TableCell>
                  <TableCell >{row.longitude}</TableCell>
                  <TableCell >{row.type}</TableCell>
                </TableRow>
              )) :
                <TableRow>

                </TableRow>
              }
            </TableBody>
          </Table>

          {
            this.state.airports.length > 0 ?
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <ArrowBackIcon onClick={this.loadPrevious} /> <center>Showing <b>{this.state.firstIndex}-{this.state.lastIndex}</b> of <b>{this.state.filteredData.length > 0 ? this.state.filteredData.length : this.state.data.length} </b> results</center> <ArrowForwardIcon onClick={this.loadNext} />
              </div>
              :
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <ArrowBackIcon onClick={this.loadPrevious} /> <center>Showing <b>{0}-{0}</b> of <b>{0} </b> results</center> <ArrowForwardIcon onClick={this.loadNext} />
              </div>
          }
        </TableContainer>

      </>
    );
  }
}

