export const picUrl = 'https://cn.bing.com/th?id=OIP.WMpknoaU9SsncVEW7W6SzAHaLH&pid=Api&rs=1'
export const vedioUrl = 'http://cdn.moji.com/websrc/video/video621.mp4'
export const isVedio = true

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
    return arr.reduce((result, item)=> {
        return result.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}

const roles = ['高级柜员', '柜员', '主管', '客户经理']

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

export function format(workers){
	return [ 
		workers.filter((i) => i.role === '高级柜员'),
		workers.filter((i) => i.role === '客户经理'),
		workers.filter((i) => i.role === '主管'),
		workers.filter((i) => i.role === '柜员'),
	]
}