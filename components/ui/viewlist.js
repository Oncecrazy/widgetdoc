define('viewlist', function(require, exports, module){
    var SliderLoad = require('sliderload');

    module.exports = function(options){
        var viewList = new SliderLoad({
            container : '.viewlist'
        });

        viewList.on('beforepull', function(obj){
            var $domUp = obj.$element.find('.dropload-up');
            if(!$domUp.length){
                $domUp = $('<div class="dropload-up"></div>');
                obj.$element.prepend( $domUp );
            }

            $domUp.html('').append('<div class="dropload-refresh">↓下拉刷新</div>');
            $domUp.css('height', obj.data.offsetY);
        });

        viewList.on('afterpull', function(obj){
            var $domUp = obj.$element.find('.dropload-up');
            if($domUp.length){
                $domUp.html('').append('<div class="dropload-update">↑释放更新</div>');
                $domUp.css('height', obj.data.offsetY);
            } 
        });

        viewList.on('pullload', function(obj){ //下拉
            var $domUp = obj.$element.find('.dropload-up');
            droploadTransition($domUp, 300);
            if($domUp.length){
                $domUp.html('').append('<div class="dropload-load"><span class="loading"></span>加载中...</div>');
                $domUp.css('height', $domUp.children().height());
            } 
            viewList.emit('pulldata', obj, function(){
                $domUp.remove();
            });
        });

        viewList.on('beforepush', function(obj){
            var $domDown = obj.$element.find('.dropload-down');
            if(!$domDown.length){
                $domDown = $('<div class="dropload-down"></div>');
                obj.$element.append( $domDown );
            }

            $domDown.html('').append('<div class="dropload-refresh">↑下拉加载更多</div>');
            $domDown.css('height', obj.data.offsetY);
        });

        viewList.on('afterpush', function(obj){
            var $domDown = obj.$element.find('.dropload-down');
            if($domDown.length){
                $domDown.html('').append('<div class="dropload-update">↓释放加载</div>');
                $domDown.css('height', obj.data.offsetY);
            } 
        });

        viewList.on('pushload', function(obj){ //上推
            var $domDown = obj.$element.find('.dropload-down');
            droploadTransition($domDown, 300);
            if($domDown.length){
                $domDown.html('').append('<div class="dropload-load"><span class="loading"></span>加载中...</div>');
                $domDown.css('height', $domDown.children().height());
            } 
            viewList.emit('pulldata', obj, function(){
                $domDown.remove();
            });
        });

        function droploadTransition($elem, num){
            $elem.css(transitions('transition', 'all '+num+'ms'));
        }

        function transitions(s, v) {
            var prefix = ['Moz', 'Ms', 'O', 'Webkit'],
                cssObj = {},
                ds = s.replace(/([a-z]{1})/, function(a, b) {
                    return b.toUpperCase();
                });
            for (var i = 0; i < prefix.length; i++) {
                cssObj[prefix[i] + ds] = v;
            }
            cssObj[s] = v;
            return cssObj;
        }
    } 
});