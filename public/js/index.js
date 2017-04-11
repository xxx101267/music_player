/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	//import {methed} from './fn';

	//@import  './tools/fn'

	//console.log(1)

	//初始显示


	//loading 画图
	// var LoadingImg = new LoadingImg({
	// 	canvas:document.getElementById('loadingImg')
	// });
	// 	LoadingImg.init();

	//playerInter();

	//播放器展开
	// var MusicPlayerOpen = new MusicPlayerOpen();
	// 	MusicPlayerOpen.init();

	//播放点击
	// var Audio = new Audio();
	// 	Audio.init();

	//播放进度
	// var ProgressClick = new ProgressClick();
	// 	ProgressClick.init();	

	//声音控制
	// var volumescoll = new Volumescoll();
	// 	volumescoll.init();

	//更换背景点击
	// var side = new Side();
	// 	side.init();


	//上一曲下一曲
	// var prevnextSong = new PrevnextSong();
	// 	prevnextSong.init();

	// //音频
	//analyserMus();
	"use strict";

/***/ }
/******/ ]);