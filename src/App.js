import React, { Component } from 'react'
import axios from 'axios'
import { grommet } from "grommet/themes"
import { Download, Schedule, Search } from 'grommet-icons'
import { Grommet, TextInput, Box, Button, Text, DropButton } from 'grommet'
import fileDownload from 'js-file-download'

import DropContent from './components/DropContent'
import IndMap from './components/IndMap'
class App extends Component {
  state = {
    points: [],
    suggestions: [],
    term: '',
    open: false,
    date: '',
    time: '12:00 am',
  }

  onSearch = async (suggestions, term, date, time) => {
    const apiUri = process.env.REACT_APP_API_URI || 'http://localhost:3000/api'
    console.log(apiUri)
    const response = await axios.get(`${apiUri}/query/recent?term=${term}${date ? `&since=${new Date(`${new Date(date).toLocaleDateString()} ${time}`).toISOString()}` : ''}`)
    this.setState({ points: response.data, suggestions: [...suggestions, term] })
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
        suggestions,
        open,
        date,
        time
      },
      onSearch,
      onDownload
    } = this
    const onClose = (nextDate, nextTime) => {
      this.setState({ date: nextDate, time: nextTime, open: false })
      setTimeout(() => this.setState({ open: undefined }), 1)
    }
    return (
      <Grommet full theme={grommet}>
        <Box align="center" justify="center" pad="medium" direction="row">
          <Box align="center" pad={{ right: 'small' }}>
            <Text textAlign="center">
              Search For
            </Text>
          </Box>
          <Box width="medium">
            <TextInput
              placeholder='Tweets'
              value={term}
              onChange={e => this.setState({ term: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onSearch(suggestions, term, date, time)
                }
              }}
            />
          </Box>
          <Box align="center" pad={{ left: 'small' }}>
            <Text textAlign="center">
              since
            </Text>
          </Box>
          <Box>
            <DropButton
              open={open}
              onClose={() => this.setState({ open: false })}
              onOpen={() => this.setState({ open: true })}
              dropContent={
                <DropContent date={date} time={time} onClose={onClose} />
              }
            >
              <Box direction="row" gap="medium" align="center" pad="small">
                <Text color={date ? undefined : "dark-5"}>
                  {date
                    ? `${new Date(date).toLocaleDateString()} ${time}`
                    : "Select date & time"}
                </Text>
                <Schedule />
              </Box>
            </DropButton>
          </Box>
          <Button
            icon={<Search />}
            onClick={e => {
              onSearch(suggestions, term, date, time)
            }}
          />
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
