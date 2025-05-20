import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import '../css/mapView.css'
import {
    getClientHeight,
    Daytrip,
    gaodeKey
} from '../tools'

const Gaode = forwardRef(({ totalData, data, removeItem, AddOneItem, changePlan, pointIndex }, ref) => {
    const [mapG, setMapG] = useState(null)
    const [pointsG, setPointsG] = useState([]) 
    const [windowsG, setWindowsG] = useState([]) 
    const [amapClass, setAmapClass] = useState(null)
    const [open, setOpen] = useState(false)
    const [rePlanOpen, setRePlanOpen] = useState(false)
    const [dayData] = useState(new Daytrip())

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
                center:center(data, pointIndex), 
            });

            map.addControl(new AMap.Scale());
            map.addControl(new AMap.Geolocation());

            let pointsArray = []
            let infoWindowsArray = []
            let lonLat = []
            if(data && data.length > 0){
                data.forEach((item, index) => {
                    lonLat.push([parseFloat(item.longitude), parseFloat(item.latitude)])
                    let window = windowConstructor(AMap, item.nameOfScence, item.des, item.picURL, removeItem, add, editItem, index)
                    infoWindowsArray.push(window)
                    let point = markerConstructor(AMap, parseFloat(item.longitude), parseFloat(item.latitude), item.nameOfScence, index)
                    point.on('click', (obj) => openOrcloseWindow(obj, window, map))
                    pointsArray.push(point)
                })
                map.add(pointsArray);
                infoWindowsArray[pointIndex].open(map,lonLat[pointIndex]);

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

    const windowConstructor = (amapClass, title, des, picURL, fn, fn1, fn2, index) => {
        let window = new amapClass.InfoWindow({
            isCustom: true,
            content: content (title, des, picURL, fn, fn1, fn2, index), 
            offset: new amapClass.Pixel(0, -30)
        })
        return window
    }

    const center = (data, pointIndex) => {
        if(data && data.length > 0){
            return [parseFloat(data[pointIndex].longitude),parseFloat(data[pointIndex].latitude)]
        } else {
            return [116.39, 39.9]
        }
    }

    const openAPP = () => {
        const point = data[pointIndex];
        const { longitude, latitude } = point;
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        let navUrl = '';
        if (isIOS) {
            navUrl = `iosamap://path?sourceApplication=NextSticker&dlon=${longitude}&dlat=${latitude}&dev=0&t=2`
        } else if (isAndroid) {
            navUrl = `amapuri://route/plan/?sourceApplication=NextSticker&dlat=${latitude}&dlon=${longitude}&dev=0&t=2`;
        } else {
            alert('当前设备不支持打开高德地图');
            return;
        }
        window.location.href = navUrl;
    }

    const content  = (title1, des1, picUrl, fn, fn1, fn2, index) => {
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
            img.onclick = openAPP
            imgContainer.appendChild(img)
            windowContainer.appendChild(imgContainer)
        } 

        return windowContainer
    }

    const add = () => {
        console.log("添加详细数据弹窗：")
        console.log(getInfo())
        dayData.nameOfScence = getInfo().name
        dayData.longitude = getInfo().lng
        dayData.latitude = getInfo().lat
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
            console.log(obj.target.getTitle())
            // 获取点击的 Marker 的坐标
            const position = obj.target.getPosition();
            
            // 如果信息窗体已经打开，则关闭它
            if (window.getIsOpen()) {
                window.close();
            } else {
                // 否则，在点击的 Marker 位置打开信息窗体
                window.open(map, position);
                // 将地图中心移动到该 Marker
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
        mapG.panTo(pointsG[index].getPosition())
    }

    useImperativeHandle(ref, () => ({
        choosePoint,
    }));

    return (
        <div className="outerContainer">
            <div id="container" className="map" style={{ height: `${getClientHeight()}px` }}>
            </div>
        </div>
    );
})

export default React.memo(Gaode)