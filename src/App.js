import React, { Component } from 'react'
import styled from 'styled-components'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import IndMap from './components/IndMap'


class App extends Component {
  state = {
    points: [],
    term: ''
  }

  onSearch = async (term) => {
    const response = await axios.get(`http://localhost:3002/api/query/recent?term=${term}`)
    this.setState({ points: response.data })
  }

  render() {
    const {
      state: {
        points,
        term,
      },
      onSearch
    } = this
    return (
      <Container>
        <SearchBar>
          <input type="text" placeholder="Search for..." value={term} onChange={e => this.setState({ term: e.target.value })} onKeyDown={e => {
            if (e.key === 'Enter') {
              onSearch(term)
            }
          }} />
          <button onClick={() => onSearch(term)}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </SearchBar>
        <IndMap points={points} />
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* padding: 40px; */
  
`


const SearchBar = styled.div`
  display: flex;
  align-self: center;
  width: 50%;
  margin: 30px;
  &>input {
    width: 100%;
    border: 3px solid #00B4CC;
    border-right: none;
    padding: 5px;
    height: 20px;
    border-radius: 5px 0 0 5px;
    outline: none;
    color: #9DBFAF;
    &:focus {
      color: #00B4CC;
    }
  }
  &>button {
    width: 40px;
    height: 36px;
    border: 1px solid #00B4CC;
    background: #00B4CC;
    text-align: center;
    color: #fff;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    font-size: 20px;
  }
`

export default App
