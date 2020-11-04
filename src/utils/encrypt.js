import CryptoJS from 'crypto-js';
import md5 from 'js-md5';

function encrypt(word, keyStr, ivStr) {
	keyStr = keyStr || 'aWRhdWtpZGF1a2lk';
	ivStr = ivStr || 'A-16-Byte-String';
	const key = CryptoJS.enc.Utf8.parse(keyStr);
	const iv = CryptoJS.enc.Utf8.parse(ivStr);
	const srcs = CryptoJS.enc.Utf8.parse(word);

	const encrypted = CryptoJS.AES.encrypt(srcs, key, {
		iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.toString();
}

// 解密
// function decrypt(word, keyStr, ivStr) {
// 	keyStr = keyStr || 'aWRhdWtpZGF1a2lk';
// 	ivStr = ivStr || 'A-16-Byte-String';
// 	var key = CryptoJS.enc.Utf8.parse(keyStr);
// 	const iv = CryptoJS.enc.Utf8.parse(ivStr);

// 	var decrypt = CryptoJS.AES.decrypt(word, key, {
// 		iv,
// 		mode: CryptoJS.mode.CBC,
// 		padding: CryptoJS.pad.Pkcs7
// 	});
// 	return decrypt.toString(CryptoJS.enc.Utf8);
// }

function encodeBase64(str) {
	return btoa(encodeURI(str));
}

function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

export function encodeSign(config) {
	const encryptType = config.headers['et'] || 'a';
	let keyStr = encryptType + 'aukidaukidaukidaukid';
	keyStr = encodeBase64(keyStr).substr(-16, 16);
	let A = '', B = '', C = '', D = '', E = '';
	A = encrypt((config.method).toUpperCase(), keyStr); //method
	B = config.url.split('?')[0] ? encrypt(config.url.split('?')[0], keyStr) : ''; //url
	C = config.url.split('?')[1] ? config.url.split('?')[1] + '&' : ''; //拼接在url上的query参数
	if(config.params){ //get提交的query参数 默认content-type  application/x-www-form-urlencoded
		for(let key in config.params){
			C += (key + '=' + config.params[key] + '&')
		}
	}
	C = C ? encrypt(C, keyStr) : '';
	if (config.headers['Content-Type'] === 'application/json') {
		if(typeof config.data == 'string'){
			E = config.data ? encrypt(config.data, keyStr) : '';
		}else {
			E = config.data ? encrypt(JSON.stringify(config.data), keyStr) : '';
		}
	} else if (config.headers['Content-Type'] === 'multipart/form-data') { // 文件上传
	}  else {
		D = config.data ? encrypt(decodeURIComponent(config.data) + '&', keyStr) : '';
	}
	let str = A + B + C + D + E;
	str = md5(str).substr(0, 10);
	return str;
}

export function encodeReq(config) {
	const encryptType = config.headers['et'] || 'a';
	let keyStr = encryptType + 'aukidaukidaukidaukid';
	keyStr = encodeBase64(keyStr).substr(-16, 16);
	const uuid = guid();
	const nowTimestamp = new Date().valueOf();
	const serveTimestamp = nowTimestamp + (Number(localStorage.getItem('kid_diffTimestamp')) || 1000);
	const reqId = uuid + '.' + parseInt(serveTimestamp / 1000);
	let reqSign = encrypt(uuid, keyStr);
	reqSign = md5(reqSign).substr(0, 10);
	const reqTt = 'a';
	return {
		reqId,
		reqSign,
		reqTt
	};
}
