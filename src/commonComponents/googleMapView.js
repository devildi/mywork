import React, { useState, useEffect, Component, useRef } from 'react'
import ReactDOM from "react-dom";
import '../css/mapView.css'
import axios from 'axios'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import Clear from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Container, Draggable } from 'react-smooth-dnd';
import {
  Map, 
  InfoWindow, 
  Marker, 
  GoogleApiWrapper
} from 'google-maps-react';

import {
    getClientHeight,
    Daytrip,
    style,
    googleKey,
    googleMapcontainerStyle,
} from '../tools'

function  GoogleMapComponent ({google, totalData, data, removeItem, AddOneItem, changePlan, rePlaceOneItem}){
    const [mapG, setMapG] = useState(null)
    const [value, setValue] = useState('')//搜索框
    const [result, setResult] = useState([])
    const [open, setOpen] = useState(false)
    const [rePlanOpen, setRePlanOpen] = useState(false)
    const [dayData, setDayData] = useState(new Daytrip())
    const [cache, setCache] = useState(new Daytrip())
    const [replanIndex, setReplanIndex] = useState(0)
    const [activeMarker, setActiveMarker] = useState(null)
    const [centerPointObj, setCenterPointObj] = useState(null)
    const [titleG, setTitleG] = useState('')
    const [desG, setDesG] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [showingInfoWindow, setShowingInfoWindow] = useState(false)
    const [placeService, setPlaceService] = useState(null)
    const [cacheMarker, setCacheMarker] = useState(null)
    const [loadingPic, setLoadingPic] = useState(false)
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const markersRef = useRef([])
    useEffect(() => {
      if(data && data.length > 0){
        setDayData(new Daytrip(data[0].nameOfScence, data[0].longitude, data[0].latitude, data[0].des, data[0].picURL));
      }
    }, [data]);

    useEffect(() => {
      console.log('google地图开始渲染！', totalData, data)
      markersRef.current = []
      if(data && data.length > 0){
        setCenter(data[0])
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

    const content  = (name, fn, item) => {
      var windowContainer = document.createElement("div");
      var title = document.createElement("div");
      title.innerHTML = name
      windowContainer.appendChild(title)
      var appand = document.createElement("div");
      appand.innerHTML = '添加到当日行程'
      appand.onclick = () => fn(item)
      windowContainer.appendChild(appand)
      return windowContainer
    }

    const add = (item) => {
      dayData.nameOfScence = item.name
      dayData.longitude = item.geometry.location.lng()
      dayData.latitude = item.geometry.location.lat()
      dayData.des = ''
      dayData.picURL = ''
      setOpen(true)
    }

    const getInfo = () => {
      let obj = {}
      setOpen(true)
    }
    //排序
    const editItem = () => {
      console.log('排序')
      setRePlanOpen(true)
      if(showingInfoWindow){
        setActiveMarker(null)
        setShowingInfoWindow(false)
      }
    }

    const choosePoint = (index) => {
      setDayData(new Daytrip(data[index].nameOfScence, data[index].longitude, data[index].latitude, data[index].des, data[index].picURL))
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

    const search = ()=>{
      setSearchLoading(true)
      if(value.trim() && value.trim()!== ''){
        const request = {
          query: value.trim(),
          fields: ["name", "formatted_address", "geometry"],
        }
        try {
          placeService.findPlaceFromQuery(
            request,
            (
              results: google.maps.places.PlaceResult[] | null,
              status: google.maps.places.PlacesServiceStatus
            ) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                console.log(results[0].geometry.location.lat())
                setResult(results)
                setSearchLoading(false)
              }
            }
          )
        } catch (error) {
          alert('系统错误，请稍后重试！')
          console.log(error)
          setSearchLoading(false)
        }
      }
    }

    const inJectPoint = (item) => {
      if(cacheMarker){
        cacheMarker.setMap(null)
      }
      let lat = item.geometry.location.lat()
      let lng = item.geometry.location.lng()
      const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: mapG,
        title: item.name
      });
      const infowindow = new google.maps.InfoWindow({
        content: content(item.name, add, item),
        ariaLabel: item.name,
      });
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          mapG,
        });
      });
      let center = {}
      center.lat = lat
      center.lng = lng
      setCenterPointObj(center)
      setCacheMarker(marker)
    } 

    const clear = () => {
        setResult([])
        setValue('')
        if(cacheMarker){
          cacheMarker.setMap(null)
          setCacheMarker(null)
        }
    }

    const closeModal = () => {
        setOpen(false)
    }

    const closeReplanModal = () => {
        setRePlanOpen(false)
    }

    const changeContent = (c, str) => {
        if(str === 'category'){
            dayData[str] = parseInt(c)
        }else {
            dayData[str] = c
        }
        dayData[str] = c
        setDayData({...dayData})
    }

    const addItemFromMap = ()=> {
        if(dayData.des === '' || dayData.picURL === ''){
            return alert('有未填项目！')
        }
        const index = data.findIndex(item => item.nameOfScence === dayData.nameOfScence)
        if(index === -1){
          AddOneItem({...dayData})
          closeModal()
          setDayData(new Daytrip(data[0].nameOfScence, data[0].longitude, data[0].latitude, data[0].des, data[0].picURL))
          setResult([])
          setValue('')
          if(cacheMarker){
            cacheMarker.setMap(null)
            setCacheMarker(null)
          }
        } else {
          rePlaceOneItem(index, {...dayData})
          closeModal()
          const newArray = data.with(index, {...dayData});
          setDayData(new Daytrip(data[index].nameOfScence, data[index].longitude, data[index].latitude, data[index].des, data[index].picURL))
          setTitleG('')
        }
    }

    const replanStart = (item, index) => {
        console.log(`将第${index+1}天的第${item +1}个景点移动到：`)
        let deleteItem = totalData[index][item]
        Object.keys(deleteItem).forEach((key) => {
            cache[key] = deleteItem[key]
        })
        if(setReplanIndex !== 0){
            setReplanIndex(0)
        }
    }

    const findIndex = (arr, str) => {
        let indexArr = []
        for(let i = 0 ; i < arr.length; i++){
            for(let j = 0 ; j < arr[i].length ; j++){
                if(arr[i][j].nameOfScence === str){
                    indexArr.push(i)
                    indexArr.push(j)
                    break
                }
            }
        }
        return indexArr
    }

    const replan = (e) => {
        let newIndex = replanIndex + 1
        if(replanIndex < totalData.length ){
            setReplanIndex(newIndex)
        }
        const { removedIndex, addedIndex } = e
        if (removedIndex === null && addedIndex === null) return 
        if(addedIndex !== null){
            console.log(`第${replanIndex + 1}天的第${addedIndex + 1}处！`)
            let arr = JSON.parse(JSON.stringify(totalData))//深拷贝
            let indexARRAY = findIndex(arr, cache.nameOfScence)
            arr[indexARRAY[0]].splice(indexARRAY[1], 1)
            arr[replanIndex].splice(addedIndex, 0 ,cache)
            changePlan(arr)
            setCache(new Daytrip())
        }
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
      setDayData(new Daytrip(objArray[0].nameOfScence, objArray[0].longitude, objArray[0].latitude, objArray[0].des, objArray[0].picURL))
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

    const test = (title) => {
      if(showingInfoWindow){
        setTitleG('')
        setDesG('')
        setImgUrl('')
        setActiveMarker(null)
        setShowingInfoWindow(false)
      }
      for(let i = 0; i < data.length; i++){
        if(data[i].nameOfScence === title){
          removeItem(i)
        }
      }
    }

    const handleFocus = (str) => {
      console.log(str)
      if(str === 'des'){
        setLoadingInfo(true)
        axios.get(`/api/chat/getDes?chat=${dayData.nameOfScence}`)
        .then((res) => {
            changeContent(res.data, str)
            setLoadingInfo(false)
        })
        .catch((err) => {
            console.log(err)
            setLoadingInfo(false)
        })
      }else {
        setLoadingPic(true)
        axios.get(`/api/trip/getBingImg?point=${dayData.nameOfScence}`)
        .then((res) => {
            changeContent(res.data, str)
            setLoadingPic(false)
        })
        .catch((err) => {
            console.log(err)
            setLoadingPic(false)
        })
      }
    }

    const closeWindow = () => {
      setTitleG('')
      setDesG('')
      setImgUrl('')
      setActiveMarker(null)
      setShowingInfoWindow(false)
    }

    const showInfo = () => {
      console.log('点击图片')
      setOpen(true)
    }

    return (
        <div className="outerContainer">
            <div id="container" className="map" style={{ height: `${getClientHeight()}px` }}>
              {
                data && data.length > 0
                ?<Map 
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
                        <img className="img" src={imgUrl} alt='' onClick={showInfo}/>
                      </div>
                      <div className="btnContainer">
                        <div onClick={editItem}>景点排序</div>
                        <div onClick={() => test(titleG)}>删除此点</div>
                      </div>               
                    </div>
                  </InfoWindowEx>
                </Map>
                :<Map 
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
                        <img className="img" src={imgUrl} alt=''/>
                      </div>
                      <div className="btnContainer">
                        <div onClick={editItem}>景点排序</div>
                        <div onClick={() => test(titleG)}>删除此点</div>
                      </div>               
                    </div>
                  </InfoWindowEx>
                </Map>
              }
            </div>
            <div className="textFieldContainer">
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">请输入关键字</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type='text' 
                        value={value}
                        onChange={(e)=>{setValue(e.target.value)}}
                        endAdornment={
                            searchLoading
                            ?<InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                                >
                                    <CircularProgress size={20} />
                                </IconButton>
                            </InputAdornment>
                            :
                            result && result.length > 0
                            ?<InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={clear}
                                  edge="end"
                                >
                                    <Clear />
                                </IconButton>
                            </InputAdornment>
                            :<InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={search}
                              edge="end"
                            >
                                <Search />
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                <div className="resultsContainer">
                {
                    result && result.length > 0
                    ?<List>
                    {result.map((item, index) => {
                        return (
                            <div key={index} onClick={() => {inJectPoint(item)}}>
                                <ListItem >
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            </div>  
                        )
                    })
                    }
                    </List>
                    :null
                }
                </div>
            </div>
            <div className="listContainer" style={{ 
              left: document.body.clientWidth < getClientHeight() ? '20px' : '220px' ,
              maxHeight: `${getClientHeight() - 100}px`, // Set your desired maximum height here
              overflowY: 'auto',  // Enable vertical scrolling when content exceeds maxHeight
              position: 'absolute',
            }}>
                {data && data.length > 0
                  ?<List>
                  {
                    data.map((item, index) => {    
                      return (
                        <div 
                          key={item.nameOfScence} 
                          onClick={() => {choosePoint(index)}}
                        >
                          <ListItem >
                            <ListItemText primary={item.nameOfScence} />
                          </ListItem>
                          <Divider />
                        </div>  
                      )
                  })  
                  }
                  </List>
                  :null
                }
            </div>
            <Dialog open={open} onClose={closeModal}>
                <DialogTitle>请完善如下信息：</DialogTitle>
                <div className="textContainer">
                    <TextField
                      label="nameOfScence" 
                      value={dayData.nameOfScence}
                      onChange={(e) => {changeContent(e.target.value, "nameOfScence")}}
                    />
                    <div>
                      <TextField 
                        label="longitude" 
                        value={dayData.longitude}
                        onChange={(e) => {changeContent(e.target.value, "longitude")}}
                      />
                      <TextField 
                        label="latitude" 
                        value={dayData.latitude}
                        onChange={(e) => {changeContent(e.target.value, "latitude")}}
                      /> 
                    </div>
                    <TextField 
                      label="des" 
                      multiline 
                      value={dayData.des }
                      onChange={(e) => {changeContent(e.target.value, "des")}}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button 
                              variant="text" 
                              onClick={() => handleFocus("des")}
                              size="small"
                            >
                              {!loadingInfo ? '获取描述' : '正在获取描述中'}
                            </Button>
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField 
                      multiline 
                      label="picURL" 
                      value={dayData.picURL}
                      onChange={(e) => {changeContent(e.target.value, "picURL")}}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button 
                              variant="text" 
                              onClick={() => handleFocus("picURL")}
                              size="small"
                            >
                              {!loadingPic ? '获取图片' : '正在获取图片中'}
                            </Button>
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField 
                      label="pointOrNot" 
                      value={dayData.pointOrNot}
                      onChange={(e) => {changeContent(e.target.value, "pointOrNot")}}
                    />
                    <TextField 
                      label="category" 
                      value={dayData.category}
                      onChange={(e) => {changeContent(e.target.value, "category")}}
                    />
                    <TextField 
                      label="contructor" 
                      value={dayData.contructor}
                      onChange={(e) => {changeContent(e.target.value, "contructor")}}
                    />
                    <div className='btnContainer'>
                      <Button 
                          color="primary" 
                          variant="contained"
                          onClick={addItemFromMap}
                      >
                          保存到当日行程
                      </Button>
                    </div>
                </div>
            </Dialog>
            <Dialog open={rePlanOpen} onClose={closeReplanModal}>
                <DialogTitle>请拖动排序：</DialogTitle>
                <div className='replanContainer2'>
                {
                    totalData.map((item, index) => (
                        <div key={index} className='replanContainer1'>
                            <div className='titlereplan'>{`第${index + 1}天`}</div>   
                            <Container 
                                orientation="horizontal"
                                className='replanContainer' 
                                style={style}
                                groupName="1"
                                getChildPayload={(i) => replanStart(i, index)}
                                onDrop={replan}
                            >
                                {
                                    item.map((item2, index2) => (
                                        <Draggable 
                                            key={item2.nameOfScence} 
                                            style={{height: '30px'}}
                                        >
                                        <div 
                                            className='itemContainer'
                                        >
                                            {item2.nameOfScence}
                                        </div>
                                        </Draggable>
                                    ))
                                }
                            </Container>
                        </div>
                    ))
                }
                </div>
            </Dialog> 
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: (googleKey)
})(GoogleMapComponent)

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