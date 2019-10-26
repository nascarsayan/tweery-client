import React, { Component } from 'react'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react'

export class MapContainer extends Component {
  state = {
    ind: {
      lat: [6.5546079, 35.6745457],
      lng: [68.1113787, 97.395561]
    },
    activeMarker: {},
    selectedPlace: {
      title: ''
    },
    showingInfoWindow: false
  }
  onMarkerClick = (props, marker) =>
    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    })

  onInfoWindowClose = () =>
    this.setState({
      activeMarker: null,
      showingInfoWindow: false
    })

  onMapClicked = () => {
    if (this.state.showingInfoWindow)
      this.setState({
        activeMarker: null,
        showingInfoWindow: false
      })
  }
  render() {
    const {
      state: {
        ind: {
          lat,
          lng
        },
        // activeMarker,
        // showingInfoWindow,
        selectedPlace: {
          title,
          // url
        }
      },
      props: {
        points
      },
      onMapClicked,
      // onInfoWindowClose
    } = this
    return (
      <React.Fragment>
        <div>
          {title}
        </div>
        <Map
          style={{
            width: '90%',
            height: '90%',
            position: 'relative'
          }}
          google={this.props.google}
          zoom={5}
          onClick={onMapClicked}
          initialCenter={{
            lat: (lat[0] + lat[1]) / 2,
            lng: (lng[0] + lng[1]) / 2,
          }}>
          {(points).map((point, i) => {
            const lat = point.coord[0].reduce((acc, nxt) => parseFloat(acc) + parseFloat(nxt[1]), 0) / point.coord[0].length
            const lng = point.coord[0].reduce((acc, nxt) => parseFloat(acc) + parseFloat(nxt[0]), 0) / point.coord[0].length
            return (
              <Marker
                name={point.place}
                key={`${i}`}
                onClick={() => window.open(point.url, '_blank')}
                position={{ lat, lng }}
                title={point.text}
              />)
          })}
          {/* <InfoWindow
            marker={activeMarker}
            onClose={onInfoWindowClose}
            onClick={() => window.open(url, '_blank')}
            visible={showingInfoWindow}>
            <div>
              {title}
            </div>
          </InfoWindow> */}
        </Map>
      </React.Fragment>
    );
  }
}



export default GoogleApiWrapper({
  apiKey: 'AIzaSyBFh8igN1Toe_7D4RrFpLouR_F64HcgHkw'
})(MapContainer)