define( 'waterfall' , function( require , exports , module ){

	var Base = require( 'base' );
	var Events =  require( 'events' );
	var concat = [].concat;

	// 瀑布流构造函数
	var Waterfall = module.exports = Base.expand( function( Super ,  args ){
		if( !args )return;
		this.minW 			= 0;
		this._pos 			= [];
		this.width 			= args.width || Math.max( document.body.scrollWidth , document.documentElement.scrollWidth );
		this.elems 			= args.data;
		this.content 		= this.elems.parent();
		this.margin 		= _getCssStyles( this.elems.first() , 'margin' );
		this.data 			= _isArray( args.data ) ? args.data : _parseHtml2Arr( args.data );
		this._sortIndex 	= 0;
		_init( this );
		this.sort();
	});

	Waterfall.getPropertyFrom( Events );

	Waterfall.addProperty({

		// 加水,动态添加瀑布流元素
		addWater : function( $elems ){
			if( !this.emit( 'addWater' , this.data ) )return;
			var arr = _parseHtml2Arr( $elems );
			var marW = this.margin[0] + this.margin[1];
			_resetSize( arr , this.minW , marW , $elems );
			this.data = this.data.concat( arr );
			this.elems = concat.call( this.elems , $elems );
			this.sort();
		},

		// 排序
		sort : function(){
			var sortArr , 
				data = this.data,
				$elems = this.elems , 
				_index = this._sortIndex;
			while( _index < data.length ){
				sortArr = data.slice( _index , _index + 30 );
				_index += sortArr.length;
				sortArr = _sort.call( this , sortArr );
				_rePos( $elems , sortArr , this._sortIndex );
				this._sortIndex = _index;
			}
			// 设置瀑布流包含元素的高度
			this.content.css( 'height' , Math.max.apply( null , this._pos ) );
		},

		// 重新排序
		resort : function(){
			this._sortIndex = 0;
			_initPos( this._pos , this._pos.length );
			var data = this.data;
			for(var i=0;i<data.length;i++){
				data[i].pos && (data[i].pos = null);
			}
			this.sort();
		}

	});

	// 判断对象是否为数组
	function _isArray( arr ){
		return Object.prototype.toString.call( arr ) === '[object Array]';
	}

	// 初始化瀑布流
	function _init( waterfall ){
		var data = waterfall.data;
		var mar = waterfall.margin;
		var marW = mar[0] + mar[1];
		var minW = waterfall.minW = _getMinWidth( _getWidthArr( data ) , waterfall.width , marW );
		var columns = Math.floor( ( waterfall.width + marW ) / ( minW + marW ) );
		waterfall.content.css( 'position' ) == 'static' && waterfall.content.css( 'position' , 'relative' );
		_initPos( waterfall._pos , columns );
		_resetSize( data , minW , marW , waterfall.elems );
	}

	// 获取最小宽度
	function _getMinWidth( arr , totalWidth , marW ){
		var minW = Math.min.apply( null , arr );
		return Math.floor( ( totalWidth + marW ) / Math.round( ( totalWidth + marW ) / ( minW + marW ) ) - marW );
	}

	// 重新设置宽度
	function _resetWidth( w , minW , marW ){
		return Math.round( ( w + marW ) / ( minW + marW ) ) * ( minW + marW ) - marW;
	}

	// 根据原始宽高比重新设置高度
	function _resetHeight( w , h , _w ){
		return Math.round( _w * h / w );
	}

	// 获取宽度数组
	function _getWidthArr( arr , which ){
		var temp = [];
		which = which || 0;
		for(var i=0;i<arr.length;i++){
			temp.push( arr[ i ][ which ] );
		}
		return temp;
	}

	// 初始化最初瀑布流高度
	function _initPos( pos , len ){		
		for(var i=0;i<len;i++){
			pos[i] = 0;
		}
	}

	// 重新设置元素宽高
	function _resetSize( data , minW , mar , elems ){
		var temp , w , h;
		var borderArr = _getCssStyles( elems.first() , 'border' );
		var paddingArr = _getCssStyles( elems.first() , 'padding' );
		for(var i=0;i<data.length;i++){
			temp = data[i];
			w = _resetWidth( temp[0] , minW , mar );
			h = _resetHeight( temp[0] , temp[1] , w );
			w = w - borderArr[0] - borderArr[1] - paddingArr[0] - paddingArr[1];
			h = h - borderArr[2] - borderArr[3] - paddingArr[2] - paddingArr[3];
			elems.eq( i ).css( 'width' , w + 'px');
			elems.eq( i ).css( 'height' , h + 'px' );
			data[i] = [ w , h];
		}
	}

	// 获取元素的border、padding或margin值数组
	function _getCssStyles( $elem , style ){
		var suffix , temp = [] , res , i=0;
		suffix = style === 'border'
				? [ 'LeftWidth' , 'RightWidth' , 'TopWidth' , 'BottomWidth' ]
				: [ 'Left' , 'Right' , 'Top' , 'Bottom' ];
		while(i<4){
			res = parseInt( $elem.css( style + suffix[ i++ ] ) ) || 0;
			temp.push( res );
		}
		return temp;
	}

	// 获取jquery对象的宽高值并保存为数组
	function _parseHtml2Arr( $elem ){
		var arr = [];
		$elem.each(function(){
			$(this).css( 'position' , 'absolute' );
			arr.push( [ $(this).outerWidth() , $(this).outerHeight() ] );
		});
		return arr;
	}

	// 重新设置元素位置
	function _rePos( $elems , arr , index ){
		window.console && console.log( '正在重排第' , index + 1 , '到第' , index + 30 > $elems.length ? $elems.length : index + 30 , '个元素的位置 ...');
		var $elem , temp;
		for(var i=0;i<arr.length;i++){
			$elem = $elems.eq( index + i );
			temp = arr[i];
			$elem.animate( { left : temp[0] } );
			$elem.animate( { top : temp[1] } );
		}
		arr = null;
	}

	// 排序算法
	function _sort( arr ){
		window.console && console.log( '正在计算第' , this._sortIndex + 1 , '到第' , this._sortIndex + 30> this.elems.length ? this.elems.length : this._sortIndex + 30 , '个元素的位置 ...');
		var posArr = [] ,
			len = arr.length ,
			pos = this._pos ,
			minW = this.minW ,
			mar = this.margin ,
			marW = mar[0] + mar[1] ,
			marH = mar[2] + mar[3] ,
			i , j , k , minPos , w , size;
		while( len ){
			for(i=0;i<pos.length;i++){
				minPos = _getMinPos( pos , i + 1 );
				for(j=0;j<arr.length;j++){
					size = arr[j];
					if( size.pos )continue;
					if( ( size[0] + marW ) / ( minW + marW ) === i + 1 ){
						size.pos = [ minPos[0] * ( minW + marW ) , pos[minPos[1]] + mar[3]];
						for(k=0;k<i+1;k++){
							pos[minPos[0] + k] = size.pos[1] + size[1];
						}
						len--;
						break;
					}
				}
			}
		}
		for(i=0;i<arr.length;i++){
			posArr[i] = arr[i].pos;
		}
		return posArr;
	}

	// 获取最小高度所在索引
	function _getMinPos( pos , size ){
		var arr = [] , temp = index = i = j = 0;
		do{
			for(j=temp=0;j<size;j++){
				temp += pos[ i + j ];
			}
			arr.push( temp );
		}while( ++i + size <= pos.length );
		temp = Math.min.apply( null , arr );
		index = _indexOf( arr , temp );
		arr = pos.slice( index , index + size );
		temp = Math.max.apply( null , arr );
		return [ index , index + _indexOf( arr , temp ) ];
	}

	// 在数组中查找元素的位置
	function _indexOf( arr , item ){
		if(arr && arr.indexOf){
			return arr.indexOf( item );
		}
		for(var i=0;i<arr.length;i++){
			if( item === arr[i] ){
				return i;
			}
		}
		return -1;
	}

});