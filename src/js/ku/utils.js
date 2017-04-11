/**
 * @description canvas工具库
 * @author fuQiang
 * @time 2016.11.16
 */


var utils = {};


/**
 * 拷贝继承
 * @param  {目标对象} target 
 * @param  {属性数据} props  
 * @param  {严格模式} strict 
 */
utils.extend = function(target, props, strict){
	for(var p in props){
		if(!strict || target.hasOwnProperty(p) || target[p] !== undefined){
			target[p] = props[p];
		}
	}
}

/**
 * canvas画布坐标转换
 * @param  {绘图环境} cxt 用来获取当前画布
 * @param  {e.clientX} x   鼠标的x坐标
 * @param  {e.clientY} y   鼠标的y坐标
 * @return {data}     转换后的坐标数据
 */
utils.clent = function(cxt, x, y){
	var rect = cxt.canvas.getBoundingClientRect();
	return {
		x: x - rect.left,
		y: y - rect.top
	}
}

/**
 * 用来获取两个点之间的距离
 * @param  {起始点x} a 
 * @param  {起始点y} b 
 * @param  {运动点x} A 
 * @param  {运动点y} B 
 * @return {两点间距离}   
 */
utils.getDistance = function(a,b,A,B){
    return Math.sqrt((a - A) * (a - A) + (b - B) * (b - B));
}

/**
 * 鼠标坐标辅助线
 * @description 修正0.5pixel
 */
utils.coordinateLine = function(cxt, x, y, color){
	cxt.save();

	cxt.strokeStyle = color || "rgba(0,0,230,.5)";
	cxt.lineWidth = 0.5;

	cxt.beginPath(); //横向
	cxt.moveTo(0, y+0.5);
	cxt.lineTo(cxt.canvas.width, y+0.5);
	cxt.stroke();

	cxt.beginPath(); //纵向
	cxt.moveTo(x+0.5, 0);
	cxt.lineTo(x+0.5, cxt.canvas.height);
	cxt.stroke();

	cxt.restore()
}

/**
 * 绘制网格线
 * @param  {绘图环境}
 * @param  {线条颜色}
 * @param  {网格线x方向间距}
 * @param  {网格线y方向间距}
 * @param  {宽度} W     不写默认就是总画布大小
 * @param  {高度} H     同上
 * @return {none}       
 */
utils.drawGuide = function(cxt, color, stepx, stepy, W, H) {
    if (cxt == undefined || cxt instanceof CanvasRenderingContext2D == false) throw new Error('There is no context for canvas!');

    if (typeof color == 'undefined') {
        color = 'lightgrey';
        stepx = stepy = 10;
        W = cxt.canvas.width;
        H = cxt.canvas.height;
    }

    W = W || cxt.canvas.width;
    H = H || cxt.canvas.height;

    cxt.save();
    cxt.strokeStyle = color;
    cxt.lineWidth = 0.5;

    //-------------------------
    //网格线边界，不需要可以注释
    cxt.save();
    cxt.fillStyle = '#ffffff';
    //cxt.fillRect(0, 0, W, H);
    cxt.lineWidth = 1.8;
    cxt.strokeRect(0, 0, W, H);
    cxt.restore();
    //-------------------------

    //纵向线
    for (var i = stepx + 0.5; i < W; i += stepx) {
        cxt.beginPath();
        cxt.moveTo(i, 0);
        cxt.lineTo(i, H);
        cxt.stroke();
    }
    //横向线
    for (var i = stepy + 0.5; i < H; i += stepy) {
        cxt.beginPath();
        cxt.moveTo(0, i);
        cxt.lineTo(W, i);
        cxt.stroke();
    }
    cxt.restore();
}

utils.Tween = {
    linear: function(t, b, c, d) {
        return c * t / d + b;
    },
    easeIn: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOut: function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) *
            Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 2.70158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d) {
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};







