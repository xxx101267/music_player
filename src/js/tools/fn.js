
/************************************
*	author ： alice.xiaoxue
*	date : 2016-11-28
*   name : 美化音乐播放器
*************************************/


/*
*	初始状态
*/
function PageInit(){
	this.top=$('.top');		//title
	this.main=$('.main');	//main
}
$.extend(PageInit.prototype,{
	init:function(){
		this.defaultSet();
		this.bindEvent();
	},
	//初始化内容
	defaultSet:function(){
		//文字初始显示
		$('.songtitle span').html(data[0].name);//歌名
		$('.singer span').html(data[0].singer);//歌手

		//歌词进度条初始
		$('.progress-bar').css('width','0px');
		//$('.barhead').css('left',$('.progress-bar').css('width'));

		//歌曲列表
		var plist='';
		for(var i=0;i<data.length;i++){
			plist+='<li class="clearfix"><a href="#" class="p1">'+data[i].name+'</a><a href="#" class="p3 glyphicon glyphicon-play-circle"><span></span></a><a href="#" class="p2">'+data[i].singer+'</a></li>'
		}
		$('.songsbox').html(plist);

		//播放器展开
		$('.musicPlayer').slideDown();
	},
	bindEvent:function(){
		//播放器展开状态切换
		this.top.off('click').on('click',function(){
			this.main.slideToggle();
		}.bind(this));
	}
	
})
new PageInit().init();


//播放按键 对象-----------
function Audio(){
	this.audio=$('.audio');	//播放器
	this.play=$('.play');	//播放按钮
	
	this.progressBar=$('.progressBar .progress-bar');	//进度条盒子
	this.progress=$('.progressBar .progress');			//进度条

	this.glyphiconPlay=$('.play span');		//播放按钮样式
	//this.barhead=$('.progressBar span');	//?
	this.wordnow=$('.wordnow');		//歌词

	this.localList = $('.songsbox li');	//本地歌曲

	this.onoff=false;
	this.currentTime=0;
	this.timer=null;

	this.prevSong=$('.prev');
	this.nextSong=$('.next');
	this.num=0;
}

Audio.prototype.init=function(){
	this.audio.attr('src',data[0].src);
	this.setLyricsc(0);
	this.bindevent();
}

Audio.prototype.bindevent=function(){
	var _this =this;
	this.play.off('click').on('click',function(){  this.playstar()  }.bind(this))//播放键事件
	this.localList.off('click').on('click',function(){  
		_this.setSrc( $(this).index() );
	})//播放键事件
	
	//播放进度函数
	this.progress.off('click').on('click',function(e){
		var left = e.pageX - this.progress.offset().left;
        Audio.audio[0].currentTime = Audio.audio[0].duration * (left / 800);
        this.currentTime = Audio.audio[0].currentTime;
	}.bind(this)) 	

	//上一首、下一首
	this.prevSong.off('click').on('click',$.proxy(this.prev,this));
	this.nextSong.off('click').on('click',$.proxy(this.next,this));
}

//设置音乐地址的src,手动切换歌曲
Audio.prototype.setSrc = function(i){

	this.audio[0].currentTime = 0;
	this.audio.attr('src',data[i].src);

	Audio.onplaying();
	this.audio[0].play();
	this.setLyricsc(i);
	this.num = i;

	this.onoff = true;
}
//处理一个时间段str( [01:59.63] )  转换成秒0.444
Audio.prototype.covSec = function(str){
	return str.replace(/(\d+)\:(\d+\.\d+)/, function($0, $1, $2) {
        var m = Number($1 * 60);
        return  m + Number($2);
    });
}
//处理歌词、歌手、歌名
Audio.prototype.setLyricsc = function(index){

	var lrcArr=data[index].lrc.split('[');
	this.lrcObj=[];
	for(var i=0;i<lrcArr.length;i++){
		var newArr = lrcArr[i].split(']');
		this.lrcObj.push({
			s:this.covSec(newArr[0]),
			l:newArr[1]
		})
	};

	$('.songtitle span').html(data[index].name);//歌名
	$('.singer span').html(data[index].singer);//歌手
}
//显示歌词
Audio.prototype.showLrc = function(ct){
	var _lrcObj=this.lrcObj;
	var lrc = '';

	for (var i=0; i<_lrcObj.length; i++) {
	    var s = parseInt(_lrcObj[i].s);
	    if (ct < s) {
	        break;
	    }
	    lrc = _lrcObj[i].l;
	}
	return lrc;
}
//播放键函数
Audio.prototype.playstar=function(){
	//
	if(this.onoff==false){
	    this.audio[0].currentTime = this.currentTime;
	    this.audio[0].play();
	    this.glyphiconPlay.removeClass('glyphicon glyphicon-play').addClass('glyphicon glyphicon-pause');

	    this.onplaying();
	}else{
		this.audio[0].pause();
		this.glyphiconPlay.removeClass('glyphicon glyphicon-pause').addClass('glyphicon glyphicon-play');
	    this.currentTime = this.audio[0].currentTime;

	    this.onpause();
	}

	this.onoff=!this.onoff;
}
//切换歌词
Audio.prototype.onplaying=function(){

	this.timer = setInterval(function() {

		this.progressBar.css('width',800 * ( this.audio[0].currentTime / this.audio[0].duration ) + 'px') ;  
		//this.barhead.css('left',this.progressBar.css('width'));
		
		this.wordnow.html( this.showLrc(this.audio[0].currentTime) );

    }.bind(this), 60);

}

Audio.prototype.onpause=function(){
	clearInterval(this.timer);
}
Audio.prototype.next=function(){
	if( singleLoop ){
		this.num++;
	}else{
		this.num = randomData(0,data.length)
	}
	
	if( this.num > data.length-1 ) this.num = 0;
	Audio.setSrc(this.num);
}
Audio.prototype.prev=function(){
	if( singleLoop ){
		this.num--;
	}else{
		this.num = randomData(0,data.length)
	}

	if( this.num < 0 ) this.num = data.length-1;
	Audio.setSrc(this.num);
}

var Audio = new Audio();
	Audio.init();



/*
*	声音条
*/
function Volumescoll(){
	this.volume = $('.volume');		//音量box
	this.volumeOff = $('.glyphicon-volume-up');		//静音
	this.volumevar=$('.volume .volumevar');			//声音条的box
	this.volprogressBar=$('.volume .progress-bar');	//实际变化的声音条

	//初始化声音大小
	this.defaultVolume = 0.6;
}
Volumescoll.prototype.init=function(){
	//设置初始的声音
	this.default();
	//声音滚动条滚动事件
	this.volumevar[0].onmousewheel = function(ev){
		ev = ev || event;
		this.progress(ev);
	}.bind(this);
	//点击，改变声音
	this.volumevar.off('click').on('click',$.proxy(this.clickChange,this));
	//静音
	this.volumeOff.off('click').on('click',function(){
		Audio.audio[0].volume = 0;
		this.volprogressBar.css('width' , 0);

		this.volumeOff.removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
	}.bind(this))
}
Volumescoll.prototype.default = function(){
	//设置初始化的声音
	Audio.audio[0].volume = this.defaultVolume;
	this.volprogressBar.css('width',this.defaultVolume*100+'%')
}
Volumescoll.prototype.clickChange = function(ev){
	var obj = ev.currentTarget;

	var client_x = ev.clientX - $(obj).offset().left;	//当前点击x值（距离音量box的x值）

	var vlengthScale = client_x / this.volumevar.width();	//当前的x /  音量盒子的宽度	= 音量比例

	this.volprogressBar.css('width' , vlengthScale*100+'%');	//设置音量条形宽度
	//修改静音按钮状态
	this.offStatus(vlengthScale);
}
Volumescoll.prototype.offStatus = function(vlengthScale){
	//改变静音按钮状态
	if( vlengthScale > 0 ){
    	this.volumeOff.removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
    }else{
    	this.volumeOff.removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
    }

	Audio.audio[0].volume = vlengthScale;	//设置音量
}
Volumescoll.prototype.progress =function(e){
	var flag = true;

	var v = Audio.audio[0].volume;
	
    if (e.wheelDelta) {
        flag = e.wheelDelta > 0 ? true : false;
    } else {
        flag = e.detail < 0 ? true : false;
    }

    if (flag) {
    	if(  this.volprogressBar.width()<this.volumevar.width()  ){
    		this.volprogressBar.width(parseInt(this.volprogressBar.width()) + 10) ; 
    	}
    } else {
    	if( this.volprogressBar.width()>0  ){
    		this.volprogressBar.width(parseInt(this.volprogressBar.width()) - 10) ;
    	}
    }

    var vlengthScale = this.volprogressBar.width() / this.volumevar.width();

    vlengthScale = vlengthScale > 1 ? 1 : vlengthScale ;

    //修改静音按钮状态，设置audio
    this.offStatus(vlengthScale);

    e.preventDefault();
    return false;
}

var volumescoll = new Volumescoll();
	volumescoll.init();



//side右侧功能区
function Side(){
	this.skinPeeler=$('.sidegroup .btn-default');	//功能按钮	
	this.skinBtn = $('.skinbox img');		//皮肤切换按钮
	this.body = $(document.body);			//body
	this.text_model = $('.text_model');		//歌词模式
	this.audio_model = $('.audio_model');	//音频模式

	this.onoff=false;		//区分播放状态
	this.isAudio = false;	//判断是否为音频模式
	this.on = -1;			//记录当前选中的选项

	this.storage = [];		//本地存储

	this.search=$('.search');				//搜索页面
	this.searchText = $('.inputsearch');	//输入框
	this.searchBtn = $('.searchbutton');	//按钮
	this.searchList = $(".song_list");	//按钮
	this.fnBlock = $('.fnBlock');	//各个功能盒子
}
$.extend(Side.prototype,{
	//初始化
	init:function(){
		this.bindevent();
		this.storageFn();
	},
	//判断本地存储是否有缓存信息
	storageFn:function(){
		//换肤本地存储
		//localStorage.clear();		//清除所有的本地数据
		var storageVal = localStorage.getItem('_skin_');
		if ( storageVal && storageVal != 'null' ) {
	        this.body.css('background','url(./public/img/bj-'+storageVal+'.jpg) no-repeat');
	    }
	},
	//event
	bindevent:function(){
		this.skinPeeler.off('click').on('click',$.proxy(this.tab,this));	//选项卡按钮
		this.skinBtn.off('click').on('click',$.proxy(this.changeSkin,this));//皮肤切换按钮

		//阻止冒泡
		this.fnBlock.off('click').on('click',function(ev){ 	
			ev.preventDefault;
			ev.cancelbubble = true;
			return false;
		});

		//点击搜索
		this.searchBtn.off('click').on('click',$.proxy(this.searchFn,this));

		$(document).off('click').on('click',$.proxy(this.close,this));
	},
	//选项卡 函数
	tab:function(ev){
		var obj = ev.currentTarget;

		//音频按钮
		if( $(obj).hasClass('audio_btn') ){	
			//右边的功能块隐藏
			this.fnBlock.animate({width: 0},function(){

			});

			//如果目前是音频模式，需要切换到歌词模式,默认为false
			if(this.isAudio){	
				$(obj).removeClass('active');
				this.text_model.slideDown();
				this.audio_model.slideUp();
			}else{	//反之...
				$(obj).addClass('active');
				this.text_model.slideUp();
				this.audio_model.slideDown();
			}
			this.isAudio = !this.isAudio;
			return;
		}else{
			$(obj).removeClass('active');
			this.text_model.slideDown();
			this.audio_model.slideUp();
		}

		//点击的是当前已经显示的选项按钮
		if(this.on == $(obj).index()){
			this.on = -1;
			$(obj).removeClass('active');

			return;
		};	
		this.on = $(obj).index();

		if( this.fnBlock.is(':animated') ){return;}

		$(obj).addClass('active').siblings('button').removeClass('active');

		//功能区样式
		//1. 宽度设置为0
		//2. 寻找第index个子级内容显示
		//3. 兄弟元素隐藏
		this.fnBlock.animate({width: 0},function(){
			this.fnBlock.children().eq($(obj).index()).slideDown().siblings().hide();
			//宽度设置为280
			this.fnBlock.animate({width: 280});
		}.bind(this));
					
		

		//禁止冒泡
		ev.cancelbubble=true;
		return false;
	},
	//关闭
	close:function(ev){

		this.fnBlock.animate({width: 0});

		this.fnBlock.children().hide();
		
		this.on = -1;
		this.skinPeeler.not('.audio_btn').removeClass('active');	//除音频按钮外，其他按钮清除选中状态
	},
	//换肤函数
	changeSkin:function(ev){
		var num = $(ev.currentTarget).attr('code');
		this.body.css('background','url(./public/img/bj-'+num+'.jpg) no-repeat');

		this.storage = [];
		this.storage.push( num );
	    localStorage.setItem('_skin_', this.storage.join(','));
	},
	//音乐搜索
	searchFn : function(){ 
		var _this = this;

		// function searchSong(){
		var searchVal = this.searchText.val();
		var slDetails = $(".song_list");

		//如果输入框为空，return
		if(searchVal.trim() == "")return false;

		//数据
		jsonp({
			url :"http://so.ard.iyyin.com/s/song_with_out",
			data : {	//请求的值
				q : searchVal,		//歌名
				page : 1,	//第几页
				size:10				//每页显示几条
			},
			fnName:'showList',
			callback : "callback",//回调函数名字【默认callback】
			success : function(data){ //成功执行回调
				if(data.code === 1){
					var html = "";
					var datas = data.data; //获取当前所需数据
					/*
					 	//模板库调用方法
						var html = template("text",datas);
						slDetails.innerHTML = html;
					*/
					for(var i=0;i<datas.length;i++){
						var song_name = datas[i].song_name ? datas[i].song_name : "无";
						var singer_name = datas[i].singer_name ? datas[i].singer_name : "无";

						var arr = [];
						var list = datas[i].url_list;
						for(var j =0 ; j<list.length ; j++ ){
							if( list[j].suffix == 'mp3' ){
								arr.push( list[j].url );
							}
						}
						var url = arr[0] || '';
						var id = datas[i].song_id ? datas[i].song_id : '';
						
						html += '<li data-url="'+url+'" data-songId="'+id+'" data-songName = "'+song_name+'" data-songerName = "'+singer_name+'">'+
	                                '<span>'+song_name+'</span>'+
	                                '<span>'+singer_name+'</span>'+
	                            '</li>';
					}
					slDetails.html(html);  //设置搜索列表
					
					_this.getLyrics(); //获取在线歌词
				}else{
					alert("获取列表失败");
				}
				_this.searchText.val('');
			},//成功回调方法
			fail : function(){
				alert("网络失败！");
			}//失败回调
		});
	},
	//点击搜索列表 播放歌曲+获取歌词：
	getLyrics : function(){
		var _this = this;
		//var $lis = $(".song_list").find("li");

		$(".song_list li").on('click',function(){
			var songUrl = this.dataset.url;
			var songId = this.dataset.songid;
			var songName = this.dataset.songname;
			var songerName = this.dataset.songername;
			//获取歌词
			_this.getLy(songerName,songName,songId,songUrl);
		})
	},
	//获取歌词
	getLy:function(songerName,songName,songId,src){
		jsonp({
			url :"http://lp.music.ttpod.com/lrc/down",
			data : {
				lrcid : "",
				artist : songerName,
				title : songName,
				song_id : songId
			},//请求的值
			fnName:'showLy',
			callback : "callback",//回调的名字【默认callback】
			success : function(datas){

				if(datas.code === 1){
					data.push({
						"name" : songName,
						"singer" : songerName,
						"src" : src,
						"lrc" : datas.data.lrc
					});
					
					Audio.setSrc(data.length-1);
				}else{
					alert("获取播放地址失败");
				}
			}
		});
	}
})

var side = new Side();
side.init();




/*
*	绘制音频
*/
var canvas = document.getElementById("audio_canvas"),
    ctx = canvas.getContext("2d");

// audioSource 为音频源，bufferSource为buffer源
var audioSource , bufferSource;

//实例化音频对象
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var AC = new AudioContext();

// analyser为analysernode，具有频率的数据，用于创建数据可视化
var analyser = AC.createAnalyser();

// gain为gainNode，音频的声音处理模块
var gainnode = AC.createGain();
gainnode.gain.value = 1;

//计时器
var RAF = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

//播放音乐
var audio = $(".audio")[0];
var play = $(".play");

//var nowIndex = 0;   //当前播放到的音乐索引
var singleLoop = false; //是否单曲循环

var app = {
    init: function () {
        this.bind();
        this.trigger(0);
    },

    bind: function () {
        var that = this;
        audio.onended = function () {
        	//true  ？ 循环播放 ： 随机
        	var index = singleLoop ? ( (Audio.num + 1) % data.length ) : randomData(0,data.length);
            app.trigger(index);
            Audio.setSrc(index)
        };

        $(".random").off('click').on("click" , function(){
            singleLoop = !singleLoop;
            
            if(singleLoop){	
            	//列表循环
            	$(this).find('span').attr('class','glyphicon glyphicon-retweet')
            }else{
            	//随机
            	$(this).find('span').attr('class','glyphicon glyphicon-random')
            }
            
        });
    },

    trigger: function (index) {
        index = index >= data.length ? 0 : index;

        if (data[index].decoding)return;

        Audio.num = index;

        if (data[index].src) {
            chooseMusic(data[index].src);
        } else if (data[index].buffer) {
            playMusic(data[index].buffer);
        }
    }
};

function randomData(n,m){	//10,20
	return parseInt( Math.random()*m - n ) + n;
}

//选择audio作为播放源
function chooseMusic(src) {
    audio.src = src;
    audio.load();
    playMusic(audio);
}

//音频播放
function playMusic(arg) {
    var source;
    //如果arg是audio的dom对象，则转为相应的源
    if (arg.nodeType) {
        audioSource = audioSource || AC.createMediaElementSource(arg);
        source = audioSource;
    } else {
        bufferSource = AC.createBufferSource();

        bufferSource.buffer = arg;

        bufferSource.onended = function () {
        	alert( singleLoop )
            app.trigger(singleLoop ? (Audio.num + 1) : randomData(0,data.length));
        };

        //播放音频
        setTimeout(function () {
            bufferSource.start()
        }, 0);

        source = bufferSource;
    }

    //连接analyserNode
    source.connect(analyser);

    //再连接到gainNode
    analyser.connect(gainnode);

    //最终输出到音频播放器
    gainnode.connect(AC.destination);
}

//绘制音谱的参数
var rt_array = [],	//用于存储柱形条对象
    rt_length = 20,		//规定有多少个柱形条
    outcanvas = null;

var grd = ctx.createLinearGradient(0, 110, 0, 270);
grd.addColorStop(0, "red");
grd.addColorStop(0.3, "yellow");
grd.addColorStop(1, "#00E800");

function showTxt(msg){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px 微软雅黑";
    ctx.fillText(msg, canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

//动画初始化，获取analyserNode里的音频buffer
function initAnimation() {
    outcanvas = document.createElement("canvas");
    outcanvas.width = canvas.width;
    outcanvas.height = canvas.height / 1;

    //每个柱形条的宽度，及柱形条宽度+间隔
    var aw = canvas.width / rt_length;
    var w = aw - 5;

    for (var i = 0; i < rt_length; i++) {
        rt_array.push(new Retangle(w, 5, i * aw, outcanvas.height))
    }

    animate();
}

function animate() {
    if(!data[Audio.num].decoding){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //出来的数组为8bit整型数组，即值为0~256，整个数组长度为1024，即会有1024个频率，只需要取部分进行显示
        var array_length = analyser.frequencyBinCount;
        var array = new Uint8Array(array_length);
        analyser.getByteFrequencyData(array);	//将音频节点的数据拷贝到Uin8Array中


        //数组长度与画布宽度比例
        var bili = array_length / ( canvas.width );

        for (var i = 0; i < rt_array.length; i++) {
            var rt = rt_array[i];
            //根据比例计算应该获取第几个频率值，并且缓存起来减少计算
            rt.index = ('index' in rt) ? rt.index : ~~(rt.x * bili);
            rt.update(array[rt.index]);
        }

    }else {
        showTxt("音频解码中...")
    }

    RAF(animate);
}

//音谱条对象
function Retangle(w, h, x, y) {
    this.w = w;
    this.h = h; //小红块高度
    this.x = x;
    this.y = y;
    this.jg = 3;
    this.power = 0;
    this.dy = y; //小红块位置
    this.initY = y;
    this.num = 0;
};

var Rp = Retangle.prototype;

Rp.update = function(power){
    this.power = power;
    this.num = ~~(this.power / this.h + 0.5);

    //更新小红块的位置，如果音频条长度高于红块位置，则红块位置则为音频条高度，否则让小红块下降
    var nh = this.dy + this.h;//小红块当前位置
    if (this.power >= this.y - nh) {
        this.dy = this.y - this.power - this.h - (this.power == 0 ? 0 : 1);
    } else if (nh > this.y) {
        this.dy = this.y - this.h;
    } else {
        this.dy += 1;
    }

    this.draw();
};

Rp.draw = function(){
    ctx.fillStyle = grd;
    var h = (~~(this.power / (this.h + this.jg))) * (this.h + this.jg);
    ctx.fillRect(this.x, this.y - h, this.w, h)
    for (var i = 0; i < this.num; i++) {
        var y = this.y - i * (this.h + this.jg);
        ctx.clearRect(this.x - 1, y, this.w + 2, this.jg);
    }
    ctx.fillStyle = "#950000";
    ctx.fillRect(this.x, ~~this.dy, this.w, this.h);
};

app.init();
initAnimation();






