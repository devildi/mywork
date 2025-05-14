import React, { useState, useEffect, Component, useImperativeHandle, forwardRef } from 'react'
import ReactDOM from "react-dom";
import '../css/mapView.css'
import {
  Map, 
  InfoWindow, 
  Marker, 
  GoogleApiWrapper
} from 'google-maps-react';

import {
    getClientHeight,
    Daytrip,
    googleKey,
    googleMapcontainerStyle,
} from '../tools'

const Google = forwardRef(({ google, totalData, data, removeItem, AddOneItem, changePlan, pointIndex }, ref) => {
    const [mapG, setMapG] = useState(null)
    const [activeMarker, setActiveMarker] = useState(null)
    const [centerPointObj, setCenterPointObj] = useState(null)
    const [titleG, setTitleG] = useState('')
    const [desG, setDesG] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [showingInfoWindow, setShowingInfoWindow] = useState(false)
    const [placeService, setPlaceService] = useState(null)

    useEffect(() => {
      console.log('google地图开始渲染！', totalData, data)
      if(data && data.length > 0){
        setCenter(data[pointIndex])
      }
      if(showingInfoWindow){
        setShowingInfoWindow(false)
      }
    },[totalData, data, data?.length, removeItem])

    const setCenter = (data) => {
      let obj = {}
      obj.lat = parseFloat(data.latitude)
      obj.lng = parseFloat(data.longitude)
      setCenterPointObj(obj)
    }

    const fetchPlaces = (mapProps, map) => {
      const {google} = mapProps;
      let service = new google.maps.places.PlacesService(map)
      setPlaceService(service)
      setMapG(map)
    }

    const onMarkerClick = (props, marker) => {
      console.log(marker)
      let objArray = data.filter((item) => {
        return item.nameOfScence === props.title
      })
      if(objArray[0].nameOfScence !== titleG){
        setTitleG(objArray[0].nameOfScence)
        setDesG(objArray[0].des)
        setImgUrl(objArray[0].picURL)
        setCenterPointObj(props.position)
        setActiveMarker(marker)
        setShowingInfoWindow(true)
      } else {
        setTitleG('')
        setDesG('')
        setImgUrl('')
        setActiveMarker(null)
        setShowingInfoWindow(false)
      }
    }

    const onMapClicked = (props) => {
      console.log('点击地图', props)
    }

    const closeWindow = () => {
      setTitleG('')
      setDesG('')
      setImgUrl('')
      setActiveMarker(null)
      setShowingInfoWindow(false)
    }

    const choosePoint = (index) => {
        setCenter(data[index])
    }

    useImperativeHandle(ref, () => ({
        choosePoint,
    }))

    const openAPP = () => {
      console.log(data[pointIndex])
      const navUrl = `comgooglemaps://?daddr=${data[pointIndex].latitude},${data[pointIndex].longitude}&directionsmode=transit`
      window.location.href = navUrl
    }

    return (
        <div className="outerContainer">
            <div id="container" className="map" style={{ height: `${getClientHeight()}px` }}>
              {    
                <Map 
                  google={google} 
                  zoom={15}
                  containerStyle={googleMapcontainerStyle}
                  onReady={fetchPlaces}
                  onClick={onMapClicked}
                  center={centerPointObj}
                >
                {
                  data.map((item, index) => {
                    let obj = {}
                    obj.lat = parseFloat(item.latitude)
                    obj.lng = parseFloat(item.longitude)
                      return(
                        <Marker
                          key={index}
                          title={item.nameOfScence}
                          onClick={onMarkerClick}
                          position={obj} 
                        >
                        </Marker >
                      )
                    }
                  )
                }
                  <InfoWindowEx
                    marker={activeMarker}
                    visible={showingInfoWindow}
                    onClose={closeWindow}
                  >
                    <div className="windowContainerForGoogle">
                      <p>{titleG}</p>
                      <p>{desG}</p>
                      <div className="imgContainer">
                        <img className="img" src={imgUrl} alt='' onClick={openAPP}/>
                      </div>              
                    </div>
                  </InfoWindowEx>
                </Map>
              }
            </div> 
        </div>
    );
})

const GoogleWithRef = forwardRef((props, ref) => {
    const Wrapped = GoogleApiWrapper({
        apiKey: (googleKey)
    })((props) => <Google {...props} ref={ref} />);
    
    return <Wrapped {...props} />;
});

export default React.memo(GoogleWithRef)

class InfoWindowEx extends Component {
  constructor(props) {
    super(props);
    this.infoWindowRef = React.createRef();
    this.contentElement = document.createElement(`div`);
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      ReactDOM.render(
        React.Children.only(this.props.children),
        this.contentElement
      );
      this.infoWindowRef.current.infowindow.setContent(this.contentElement);
    }
  }

  render() {
    return <InfoWindow ref={this.infoWindowRef} {...this.props} />;
  }
}