/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('page', function(require, exports, module) {

	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		now: 1,          	 /* 当前页序号 */
		max: 20,        	 /* 最大页序号 */
		limit: 10,      	 /* 展示页序号数量 */
		showEllipsis: false, /* 是否显示省略号 */
		showEnds: false,     /* 是否显示首位页序号 */
		pageBtn : ''         /* 分页按钮 */
	}

	/**
	 * [Page Page]
	 * @description 这是一个分页组件                   
	 * @extends  	Base               	
	 * @implement   Events
	 * @param  {object}    option       配置参数  	                                
	 */
	var Page = module.exports = Base.extend(Base, function(option) {
		/**
		 * [config 配置对象]
		 * @type {object}
		 */
		this.config = null;
		this.init(option);
	});

	Base.implement(Page, Event);

	/**
	 * [init 初始化]
	 * @param  {object} option 配置参数
	 * @return {void}   
	 */
	Page.prototype.init = function(option) {
		var config = $.extend({}, defaults, option);
		this.config = config;
	}

	/**
	 * [toPage 跳转到指定页]
	 * @param  {Function} callback  完成时回调函数
	 * @return {void}  
	 */
	Page.prototype.toPage = function(num, callback) {
		var _this = this,
			config = this.config;
		num = num > this.max ? this.max :
			num < 1 ? 1 : num;
		this.config.now = num;
		this.emit('topage', num, function(data) {
			var pages = _getPages(_this);
			_this.render(pages, num, data);
			callback && callback();
		});
	}

	/**
	 * [prevPage 跳转到上一页]
	 * @param  {Function} callback  完成时回调函数
	 * @return {void}          
	 */
	Page.prototype.prevPage = function(callback) {
		this.toPage(this.config.now - 1, callback);
		callback && callback();
	}

	/**
	 * [nextPage 跳转到下一页]
	 * @param  {Function} callback  完成时回调函数
	 * @return {void}          
	 */
	Page.prototype.nextPage = function(callback) {
		this.toPage(this.config.now + 1);
		callback && callback();
	}

	/**
	 * [render 组件渲染]
	 * @param  {array} pages  分页数组
	 * @param  {number} now   当前页
	 * @param  {object} data  分页数据
	 * @return {void}       
	 */
	Page.prototype.render = function(pages, now, data) {
		this.renderBtn(pages, now);
		this.renderList(data);
	}

	/**
	 * [renderBtn 渲染分页按钮]
	 * @param  {array} pages  分页数组
	 * @param  {type} now   当前页
	 * @return {void}   
	 */
	Page.prototype.renderBtn = function(pages, now) {
	}

	/**
	 * [renderList 渲染分页列表]
	 * @param  {object} data 分页数据
	 * @return {void}    
	 */
	Page.prototype.renderList = function(data) {
	}

	/**
	 * [_getPages 获取分页数组]
	 * @private
	 * @param  {object} obj  Page分页对象
	 * @return {array}   分页数组
	 */
	function _getPages(obj) {
		var config = obj.config,
			now = config.now,
			limit = config.limit,
			max = config.max,
			half = Math.floor(limit / 2),
			pages = [],
			len = limit > max ? max : limit,
			num, temp = 0;
		// 创建应该显示的页面数组
		for (var i = 0; i < len; i++) {
			pages[i] = now - half + i;
		}
		// 页面下标越界
		if (pages[0] < 1) {
			num = 1 - pages[0];
			for (var i = 0; i < pages.length; i++) {
				pages[i] += num;
			}
		}
		// 页面上标越界
		if (pages[pages.length - 1] > max) {
			num = pages[pages.length - 1] - obj.max;
			for (var i = 0; i < pages.length; i++) {
				pages[i] -= num;
			}
		}
		// 前面显示省略号
		if (config.showEllipsis && pages[0] > 2) {
			pages.unshift('...');
			temp = 1;
			len++;
		}
		// 显示第一页
		if (config.showEnds && pages[temp] > 1) {
			pages.unshift(1);
			len++;
		}
		// 后面显示省略号
		if (config.showEllipsis && pages[len - 1] < max - 1) {
			pages.push('...');
		}
		// 显示最后一页
		if (config.showEnds && pages[len - 1] < max) {
			pages.push(max);
		}
		return pages;
	}
});