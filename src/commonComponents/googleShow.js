import React, { useState, useEffect, Component, useImperativeHandle, forwardRef, useRef } from 'react'
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
    const markersRef = useRef([])
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
      console.log('地图完成初始化：', mapProps)
      
      const {google} = mapProps;
      let service = new google.maps.places.PlacesService(map)
      setPlaceService(service)
      setMapG(map)
      if (data && data.length > 0) {
        setTitleG(data[0].nameOfScence);
        setDesG(data[0].des);
        setImgUrl(data[0].picURL);
        setCenterPointObj({
          lat: parseFloat(data[0].latitude),
          lng: parseFloat(data[0].longitude),
        });
        
        // 设置第一个 Marker 为 activeMarker
        // 注意：markersRef.current[0] 可能需要在 Marker 渲染完成后才能访问
        // 因此可以稍延迟执行（例如使用 setTimeout）
        setTimeout(() => {
          if (markersRef.current[0]) {
            setActiveMarker(markersRef.current[0].marker);
            setShowingInfoWindow(true);
          }
        }, 1000); // 延迟 100ms 确保 Marker 已渲染
      }
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
        console.log('点击了', index)  
        setCenter(data[index])
        const marker = markersRef.current[index];
        if (marker) {
          setTitleG(data[index].nameOfScence)
          setDesG(data[index].des)
          setImgUrl(data[index].picURL)
          setActiveMarker(marker.marker);
          setShowingInfoWindow(true);
        }
    }

    useImperativeHandle(ref, () => ({
        choosePoint,
    }))

    const openAPP = () => {
      const point = data[pointIndex];
      const { latitude, longitude } = point;

      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      let navUrl = '';

      if (isIOS) {
        // iOS 使用 comgooglemaps URL Scheme
        navUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=transit`;
      } else if (isAndroid) {
        // Android 使用 intent:// scheme
        navUrl = `intent://maps.google.com/maps?daddr=${latitude},${longitude}&directionsmode=transit#Intent;scheme=https;package=com.google.android.apps.maps;end;`;
      } else {
        alert('当前平台暂不支持地图跳转');
        return;
      }
      window.location.href = navUrl;
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
                          ref={(marker) => {
                            if (marker) markersRef.current[index] = marker;
                          }}
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