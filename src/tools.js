export const authority = 'wudi'
export const googleMapcontainerStyle = {
	position: 'relative',  
	width: '100%',
	height: '100%'
}
export const picUrl = [
'https://cn.bing.com/th?id=OIP.WMpknoaU9SsncVEW7W6SzAHaLH&pid=Api&rs=1',
'http://youimg1.c-ctrip.com/target/fd/tg/g4/M0A/CA/30/CggYHlbEXmaAYGfJAAnFAUl5-Pk911.jpg'
]
const vedioUrlArray = [
	'https://cdn.moji.com/websrc/video/video621.mp4',
	'https://res.cloudinary.com/dnfhsjz8u/video/upload/v1584691245/DJI_20191006_114520_418_fl2drt.mp4'
]
export const googleKeyWudi = 'AIzaSyAJHnZaO6czTIkkftjQNdtNcjL52pMxsIY'
export const googleKey = 'AIzaSyB5LS2bbGE_Iw1e7Dc3_al7glDliILip_c'
export const gaodeKey = 'fbe59813637de60223e3d22805a2486c'
export const vedioUrl = vedioUrlArray[0]
export const avatarUrl="https://res.cloudinary.com/dnfhsjz8u/image/upload/v1620372687/u_4168080911_4188088242_fm_15_gp_0_qfgrpg.jpg"
//localStorage
export const ATTANGEDATA = 'ARRANGEDATA'
export const USER = 'USER'
export const TOKEN = 'TOKEN'
export const expire = 3000//S

export const isVedio = true
export const whichPage = 0

export function saveData(str, data, expire){
	window.localStorage.setItem(
    str,
    JSON.stringify({
    	expires: Date.now() + expire * 1000,
      	data: data,
    })
  );
}

export function readData(str){
	const cache = JSON.parse(
    window.localStorage.getItem(str) || '{}'
  );
  return cache
}

export function deleteData(str){
	window.localStorage.removeItem(str);
}

export function h0(timestamp = Date.now()) {
  const target = new Date(timestamp);
  target.setHours(0);
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);
  return target.getTime();
}

export function h1(date , which){
	let day = null
	let block = null
	if(which === 0 && date > 6){
		day = date - 6
	}
	 else if(which === 0 && date <= 6) {
		day = 1
	} else {
		day = date + 1 - which
	}

	if(day === 1 && which !== 1){
		block = which - 1
	} else {
		block = 0
	}
	return{day, block}
}

export function flatten(arr) {  
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

const roles = ['高级柜员', '柜员', '主管', '客户经理']

export function format(workers){
	return [ 
		workers.filter((i) => i.role === '高级柜员'),
		workers.filter((i) => i.role === '客户经理'),
		workers.filter((i) => i.role === '主管'),
		workers.filter((i) => i.role === '柜员'),
	]
}

export const workers = [
	{
		name: '鞠小露',
		role: roles[0],
		isChoosed: false,
		days: 0
	},
	{
		name: '鞠露',
		role: roles[1],
		isChoosed: false,
		days: 0
	},
	{
		name: '小露',
		role: roles[2],
		isChoosed: false,
		days: 0
	},
	{
		name: '鞠小44',
		role: roles[3],
		isChoosed: false,
		days: 0
	},
	{
		name: '鞠66',
		role: roles[0],
		isChoosed: false,
		days: 0
	},
	{
		name: '鞠小露突突突',
		role: roles[0],
		isChoosed: false,
		days: 0
	},
]
export function fomatURL(url){
	if(url.includes('src="')){
		let array =  url.split('src="')
		let array1 = array[1].split('"')
		//console.log(array1[0])
		return array1[0]
	}else {
		return url
	}
} 

export function falmatData(array){
	if(array && array.length > 0){
			for(let i=0; i < array.length; i++){
			array[i].name = (new Date(array[i].name).getMonth()+1) +'/' + (new Date(array[i].name).getDate())
		}
		return array
	} else {
		return array
	}
}

export function color(){
	let colorValue="0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
	let colorArray = colorValue.split(",");
	let color="#"
	for(var i=0;i<6;i++){
		color+=colorArray[Math.floor(Math.random()*16)];
	}
	if(color === '#ffffff'){
		color()
	} else return color
}

export function getScrollTop(){
	let scrollTop=0
	if(document.documentElement&&document.documentElement.scrollTop)
	{
		scrollTop=document.documentElement.scrollTop
	}
	else if(document.body)
	{
		scrollTop=document.body.scrollTop
	}
	return scrollTop
}
//获取视窗高度
export function getClientHeight(){    
  let clientHeight=0
  if(document.body.clientHeight&&document.documentElement.clientHeight){    
      clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight            
  }else{    
      clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight       
  }    
  return clientHeight
}
//获取文档内容实际高度
export function getScrollHeight(){    
  return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);   
}

export const getOrigiHeight = (url) => new Promise((resolve, reject) => {
	let img = new Image()
	img.src = url;
	let check = function(){
  	if(img.width>0 || img.height>0) {
	    	clearInterval(set);
			resolve(img)
  		}
	}
	let set = setInterval(check,10)
})

export const getImg = async (url, screenWidth) => {
	let img = await getOrigiHeight(url)
	let outHeight = Math.floor(img.height * screenWidth / img.width)
	img.height = outHeight
	img.width = screenWidth
	return img
}

export const width = Math.floor(document.body.clientWidth / 2)

export const checkNullInObj = (obj) => {
	for (let key in obj){
		if(obj[key] === ''){
			return false
		}
	}
	return true
}

export const checkInArray = (arr) => {
	for (let i = 0; i < arr.length; i++){
		if(arr[i].length === 0){
			return false
		}
	}
	return true
}

export const pic = [
	'https://tse3-mm.cn.bing.net/th/id/OIP.RiVuBdPbyZfUqwaC_rMgaAHaFj?w=200&h=189&c=7&o=5&dpr=2&pid=1.7',
	'https://tse3-mm.cn.bing.net/th/id/OIP.PjwD3caT4zGrmyx5OSmsXQHaE7?w=285&h=185&c=7&o=5&dpr=2&pid=1.7',
	'https://tse4-mm.cn.bing.net/th/id/OIP.D9KCoJ2Szl3p8iiUt1XQ7wHaJQ?w=166&h=198&c=7&o=5&dpr=2&pid=1.7',
	'https://tse2-mm.cn.bing.net/th/id/OIP.SAwRQOIAiwRcVE35WAu3lgHaEK?w=293&h=164&c=7&o=5&dpr=2&pid=1.7',
	'https://tse2-mm.cn.bing.net/th/id/OIP.kzjuEOfhlRGHlAU7XTcRtgHaNJ?w=115&h=184&c=7&o=5&dpr=2&pid=1.7',
	'https://tse3-mm.cn.bing.net/th/id/OIP.rb333I9ISUGd2y2bjn-qiQAAAA?w=299&h=194&c=7&o=5&dpr=2&pid=1.7',
	'https://tse3-mm.cn.bing.net/th/id/OIP.qEiMn_h7rMBHf9QlQw8k2QHaEo?w=260&h=162&c=7&o=5&dpr=2&pid=1.7',
	'https://tse2-mm.cn.bing.net/th/id/OIP._-DDuCgiElSuM37yuL-x9wHaE4?w=275&h=177&c=7&o=5&dpr=2&pid=1.7',
	'https://tse3-mm.cn.bing.net/th/id/OIP.s_SXVVhK1MZhrGXQjWdOUAHaFm?w=212&h=160&c=7&o=5&dpr=2&pid=1.7'
]

export class Trip {
	constructor(
		uid: '',
		tripName: '',
		designer: '',
		domestic: 1,
		city: '',
		country: '',
		tags: '',
		cover: '',
		detail: [],
		) {
		this.uid = uid;
		this.tripName = tripName
		this.designer = designer
		this.domestic = domestic
		this.city = city;
		this.country = country;
		this.tags = tags;
		this.cover = cover;
		this.detail = detail
	}
}

export class Daytrip{
	constructor(
		nameOfScence = '', 
		longitude = '', 
		latitude = '',
		des = '',
		picURL = '',
		pointOrNot = true,
		contructor = 'contructor',
		category = 0,
		done = false
		) {
	  this.nameOfScence = nameOfScence;
	  this.longitude = longitude
	  this.latitude = latitude
	  this.des = des
	  this.picURL = picURL
	  this.pointOrNot = pointOrNot
	  this.contructor = contructor
	  this.category = category
	  this.done = done
	}
}

export const style = {
    width: '400px',
    margin: '5px',
    height: '120px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '5px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
}

export const tagsArray = ['文化', '古都', '逛吃', '蜜月', '自驾', '周末', '大海','古建筑', '草原', '藏传佛教','风景','长假','春节','乐园','特种兵','人文']