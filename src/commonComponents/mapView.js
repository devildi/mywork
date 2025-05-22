import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import AMapLoader from '@amap/amap-jsapi-loader'
import '../css/mapView.css'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container, Draggable } from 'react-smooth-dnd';
import {
    getClientHeight,
    Daytrip,
    style,
    gaodeKey
} from '../tools'

function  MapComponent ({totalData, data, removeItem, AddOneItem, changePlan, rePlaceOneItem}){
    const [mapG, setMapG] = useState(null)
    const [pointsG, setPointsG] = useState([]) 
    const [windowsG, setWindowsG] = useState([]) 
    const [value, setValue] = useState('')//搜索框
    const [aMapClass, setAmapClass] = useState(null)
    const [result, setResult] = useState([])
    const [open, setOpen] = useState(false)
    const [rePlanOpen, setRePlanOpen] = useState(false)
    const [dayData, setDayData] = useState(new Daytrip())
    const [cache, setCache] = useState(new Daytrip())
    const [replanIndex, setReplanIndex] = useState(0)

    const [infoOpen, setInfoOpen] = useState(false)
    const [imgsOpen, setImgsOpen] = useState(false)
    const [infoFromGoogle, setInfoFromGoogle] = useState(null)
    const [picsFromGoogle, setPicsFromGoogle] = useState([])
    const [loading, setLoading] = useState(false)
    const [errinFo, setErrinFo] = useState(null)

    const [loadingPic, setLoadingPic] = useState(false)
    const [loadingInfo, setLoadingInfo] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)

    const desRef = useRef(null);
    const picsRef = useRef(null);

    useEffect(() => {
        setDayData(new Daytrip(data[0].nameOfScence, data[0].longitude, data[0].latitude, data[0].des, data[0].picURL));
    }, [data]);

    useEffect(() => {
        console.log('地图开始渲染！', totalData)
        AMapLoader.load({
            key: gaodeKey,                     
            version:"2.0",             
            plugins:['AMap.Scale','AMap.Geolocation','AMap.AutoComplete','AMap.PlaceSearch'],             
        }).then((AMap)=>{
            let map = new AMap.Map("container",{ 
                viewMode:"3D",       
                zoom:15,              
                center:center(data), 
            });

            map.addControl(new AMap.Scale());
            map.addControl(new AMap.Geolocation());

            let pointsArray = []
            let infoWindowsArray = []
            let lonLat = []
            if(data && data.length > 0){
                data.forEach((item, index) => {
                    lonLat.push([parseFloat(item.longitude), parseFloat(item.latitude)])
                    let window = windowConstructor(AMap, item.nameOfScence, item.des, item.picURL, removeItem, add, editItem, index, imgClick)
                    infoWindowsArray.push(window)
                    let point = markerConstructor(AMap, parseFloat(item.longitude), parseFloat(item.latitude), item.nameOfScence, index)
                    point.on('click', (obj) => openOrcloseWindow(obj, window, map))
                    pointsArray.push(point)
                })
                map.add(pointsArray);
                infoWindowsArray[0].open(map,lonLat[0]);

                setPointsG(pointsArray)
                setWindowsG(infoWindowsArray)
            }
            setAmapClass(AMap)
            setMapG(map)
        })
        .catch(e=>{
            console.log(e);
        })
    },[totalData, data, data?.length, removeItem])

    const markerConstructor = (amapClass, longitude, latitude, title, extData) => {
        let point = new amapClass.Marker({
            position: new amapClass.LngLat(longitude, latitude),
            title: title,
            extData: extData
        })
        return point
    }

    const imgClick = (index) => {
        setOpen(true)
    }

    const windowConstructor = (amapClass, title, des, picURL, fn, fn1, fn2, index, imgClick) => {
        let window = new amapClass.InfoWindow({
            isCustom: true,
            content: content (title, des, picURL, fn, fn1, fn2, index, imgClick), 
            offset: new amapClass.Pixel(0, -30)
        })
        return window
    }

    const center = (data) => {
        if(data && data.length > 0){
            return [parseFloat(data[0].longitude),parseFloat(data[0].latitude)]
        } else {
            return [116.39, 39.9]
        }
    }

    const content  = (title1, des1, picUrl, fn, fn1, fn2, index, imgClick) => {
        var windowContainer = document.createElement("div");
        windowContainer.className = 'windowContainer'

        var title = document.createElement("div");
        title.className = 'title'
        title.innerHTML = title1
        windowContainer.appendChild(title)

        var des = document.createElement("div");
        des.className = 'des'
        des.innerHTML = des1

        if(des1){
            windowContainer.appendChild(des)
        }

        if(picUrl){
            var imgContainer = document.createElement("div");
            imgContainer.className = 'imgContainer'

            var img = document.createElement("img");
            img.className = 'img'
            img.src = picUrl
            img.onclick = () => imgClick(index)

            imgContainer.appendChild(img)
            windowContainer.appendChild(imgContainer)
        } 

        var btn = document.createElement("div");
        btn.className = 'btn'
        btn.innerHTML = '删除此点'
        btn.onclick = () => fn(index)
        
        var rePlan = document.createElement("div");
        rePlan.className = 'rePlan'
        rePlan.innerHTML = '景点排序'
        rePlan.onclick = () => fn2(index)
        
        var appand = document.createElement("div");
        appand.className = 'btn'
        appand.innerHTML = '添加到当日行程'
        appand.onclick = fn1

        if(check(title1, data)){
            windowContainer.appendChild(btn)
            windowContainer.appendChild(rePlan)
        } else {
            windowContainer.appendChild(appand)
        }

        return windowContainer
    }

    const add = () => {
        console.log("添加详细数据弹窗：")
        console.log(getInfo())
        dayData.nameOfScence = getInfo().name
        dayData.longitude = getInfo().lng
        dayData.latitude = getInfo().lat
        dayData.des = ''
        dayData.picURL = ''
        setOpen(true)
    }
    //排序
    const editItem = (index) => {
        setRePlanOpen(true)
    }

    const getInfo = () => {
        let obj = {}
        let points = mapG.getAllOverlays('marker')
        data.forEach((item) => {
            for(let i = 0 ; i < points.length ; i++){
                if(points[i].getTitle() === item.nameOfScence){
                    points.splice(i, 1)
                }
            }
        })
        obj.name = points[0].getTitle()
        obj.lng = points[0].getPosition().lng
        obj.lat = points[0].getPosition().lat
        return obj
    }

    const openOrcloseWindow = (obj, window, map) => {
        try {
            const index = data.findIndex(item => item.nameOfScence === obj.target.getTitle())
            if(index !== -1){
                setDayData(new Daytrip(data[index].nameOfScence, data[index].longitude, data[index].latitude, data[index].des, data[index].picURL))
                const position = obj.target.getPosition();
                window.open(map, position);
                map.panTo(position);
            }
        } catch (error) {
            console.error('Error in openOrcloseWindow:', error);
        }
    };

    const choosePoint = (index) => {
        if(!windowsG[index].getIsOpen()){
            windowsG[index].open(mapG,pointsG[index].getPosition());
        }
        setDayData(new Daytrip(data[index].nameOfScence, data[index].longitude, data[index].latitude, data[index].des, data[index].picURL))
        mapG.panTo(pointsG[index].getPosition())
    }

    const search = ()=>{
        setSearchLoading(true)
        if(value.trim() && value.trim()!== ''){
            var placeSearch = new aMapClass.PlaceSearch();
            placeSearch.search(value.trim(), function (status, result) {
                if(result.info === 'OK'){
                    setResult(result.poiList.pois)
                    setSearchLoading(false)
                } else {
                    alert('无搜索结果，请精确输入关键字！')
                    setSearchLoading(false)
                }
            });
        } else {
            alert('无搜索内容！')
            setSearchLoading(false)
        }
    }

    const inJectPoint = (item) => {
        console.log("添加项目", item)
        if(data.length !== mapG.getAllOverlays('marker').length){
            let points = mapG.getAllOverlays('marker')
            data.forEach((item) => {
                for(let i = 0 ; i < points.length ; i++){
                    if(points[i].getTitle() === item.nameOfScence){
                        points.splice(i, 1)
                    }
                }
            })
            points[0].remove()
        }
        let window = windowConstructor(aMapClass, item.name, null, null, null, add, editItem, mapG.getAllOverlays('marker').length + 1)
        let point = markerConstructor(aMapClass, item.location.lng, item.location.lat, item.name, mapG.getAllOverlays('marker').length + 1)
        point.on('click', (obj) => openOrcloseWindow(obj, window, mapG))
        mapG.add(point)
        window.open(mapG, [item.location.lng, item.location.lat])
        mapG.panTo([item.location.lng, item.location.lat])
    } 

    const clear = () => {
        setResult([])
        setValue('')
        if(data.length !== mapG.getAllOverlays('marker').length){
            let points = mapG.getAllOverlays('marker')
            data.forEach((item) => {
                console.log(item.nameOfScence)
                for(let i = 0 ; i < points.length ; i++){
                    if(points[i].getTitle() === item.nameOfScence){
                        points.splice(i, 1)
                    }
                }
            })
            points[0].remove()
            mapG.clearInfoWindow()
        }
    }

    const check = (str, array) => {
        let flag = false
        for(let i = 0 ; i < array.length; i++){
            if(array[i].nameOfScence === str){
                flag = true
                break
            }
        }
        return flag
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
        } else {
            rePlaceOneItem(index, {...dayData})
            closeModal()
            const newArray = data.with(index, {...dayData});
            setDayData(new Daytrip(data[index].nameOfScence, data[index].longitude, data[index].latitude, data[index].des, data[index].picURL))

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

    const handleFocus = (str) => {
        if(str === 'des'){
            setInfoOpen(true)
            desRef.current.blur()
            setLoading(true)
            fetchInfoFromGoogle(str)
        } else {
            setImgsOpen(true)
            picsRef.current.blur()
            setLoading(true)
            fetchInfoFromGoogle(str)
        }   
    }

    const handleCloseInfo = (str) => {
        if(str === 'des'){
            setInfoOpen(false)
            setErrinFo(null)
            setInfoFromGoogle(null)
        }else {
            setImgsOpen(false)
            setErrinFo(null)
            setPicsFromGoogle([])
        } 
    }

    const fetchInfoFromGoogle = (str) => {
        if(str === 'des'){
            axios.get(`/api/chat/getDes?chat=${dayData.nameOfScence}`)
            .then((res) => {
                setInfoFromGoogle(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                setErrinFo(err)
            })
        }else {
            axios.get(`/api/trip/getBingImg?point=${dayData.nameOfScence}`)
            .then((res) => {
                setPicsFromGoogle([res.data])
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                setErrinFo(err)
            })
        }
    }

    const getInfiOrImg = (str) => {
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
   
    return (
        <div className="outerContainer">
            <div id="container" className="map" style={{ height: `${getClientHeight()}px` }}>
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
            <div className="listContainer" style={{ left: document.body.clientWidth < getClientHeight() ? '20px' : '220px' }}>
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
                        inputRef={desRef}
                        label="des"
                        //onFocus={() => handleFocus("des")} 
                        multiline 
                        value={dayData.des }
                        onChange={(e) => {changeContent(e.target.value, "des")}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <Button 
                                    variant="text" 
                                    onClick={() => getInfiOrImg("des")}
                                    size="small"
                                >
                                    {!loadingInfo ? '获取描述' : '正在获取描述中'}
                                </Button>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        inputRef={picsRef}
                        //onFocus={() => handleFocus("picURL")}
                        multiline 
                        label="picURL" 
                        value={dayData.picURL}
                        onChange={(e) => {changeContent(e.target.value, "picURL")}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <Button 
                                    variant="text" 
                                    onClick={() => getInfiOrImg("picURL")}
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
            <Dialog 
                open={infoOpen} 
                onClose={() => handleCloseInfo('des')}
            >
                <div className='inFoContainer'>
                    <div>{loading ? '景点简介获取中...' : null}</div>
                    <TextField 
                        label="des"
                        multiline
                        fullWidth
                        value={dayData.des}
                        onChange={(e) => {changeContent(e.target.value, "des")}}
                    />
                    <div onClick={() => {changeContent(infoFromGoogle, "des")}}>{infoFromGoogle !== null ? infoFromGoogle : null}</div>
                    <div>{infoFromGoogle !== null ? '数据来自 百度百科' : null}</div>
                    <div>{errinFo !== null ? '数据获取失败，请自己填写！' : null}</div>
                    <div className='btnContainer'>
                        <Button 
                            color="secondary" 
                            variant="contained"
                            onClick={() => handleCloseInfo('des')}
                        >
                            返回
                        </Button>
                        <Button 
                            color="primary" 
                            variant="contained"
                            onClick={() => handleCloseInfo('des')}
                        >
                            保存
                        </Button>
                    </div>
                </div>
            </Dialog>
            <Dialog 
                open={imgsOpen} 
                onClose={() => handleCloseInfo('picURL')}
            >
                <div className='inFoContainer'>
                    <div>{loading ? '预览图片获取中...' : null}</div>
                    <TextField 
                        label="picURL"
                        multiline
                        fullWidth
                        value={dayData.picURL}
                        onChange={(e) => {changeContent(e.target.value, "picURL")}}
                    />
                    <div className='googleImgsContainer'>
                    {
                        picsFromGoogle.length > 0 
                        ? picsFromGoogle.map((item, index) => {
                            return (
                                <div className='googleImgsBox' onClick={() => {changeContent(item, "picURL")}} key={index}>
                                   <img className='googleImgBox' src={item}  alt=''/> 
                                </div>
                            )
                        })
                        :<div></div>
                    }
                    </div>
                    <div>{picsFromGoogle !== null && picsFromGoogle.length > 0 ? '预览图片数据来自 Bing' : null}</div>
                    <div>{errinFo !== null ? '预览图片获取失败，请自己填写图片链接！' : null}</div>
                    <div className='btnContainer'>
                        <Button 
                            color="secondary" 
                            variant="contained"
                            onClick={() => handleCloseInfo('picURL')}
                        >
                            返回
                        </Button>
                        <Button 
                            color="primary" 
                            variant="contained"
                            onClick={() => handleCloseInfo('picURL')}
                        >
                            保存
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default MapComponent