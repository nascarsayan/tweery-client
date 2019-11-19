import React, { Component } from 'react'
import axios from 'axios';
import IndMap from './components/IndMap'
import { grommet } from "grommet/themes"
import { Download } from 'grommet-icons'
import { Grommet, TextInput, Box, Button } from 'grommet'
import fileDownload from 'js-file-download'

class App extends Component {
  state = {
    points: [],
    term: ''
  }

  onSearch = async (term) => {
    const response = await axios.get(`http://localhost:3002/api/query/recent?term=${term}`)
    this.setState({ points: response.data })
  }

  dateToJSON = (date) => {
    const local = new Date(date)
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return local.toJSON().slice(0, 10)
  }

  onDownload = async (jsonstr) => {
    const {
      state: {
        term
      }
    } = this
    const curdate = this.dateToJSON(new Date())
    fileDownload(JSON.stringify(jsonstr, null, 2), `${term}-${curdate}.json`)
  }

  render() {
    const {
      state: {
        points,
        term,
      },
      onSearch,
      onDownload
    } = this
    return (
      <Grommet full theme={grommet}>
        <Box align="center" justify="start" pad="medium">
          <Box width="medium">
            <TextInput
              placeholder='Search For'
              value={term}
              onChange={e => this.setState({ term: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onSearch(term)
                }
              }}
            />
          </Box>
          <Button
            icon={<Download />}
            onClick={_ => onDownload(points)}
          />
        </Box>
        <Box>
          <IndMap points={points} />
        </Box>
      </Grommet>
    )
  }
}

export default App
