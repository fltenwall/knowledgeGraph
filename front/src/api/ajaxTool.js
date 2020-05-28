
    function AjaxTool() {}

   const ajaxTool = function (param, successCallback, failedCallback) {
        // 1. 获取参数
        var requestType = param['requestType'] || 'get'; // 请求方式
        var url = param['url'];  // 请求的路径
        var paramObj = param['paramObj'];
        var timeOut = param['timeOut'] || 0;

        // 2. 发送请求
        var xhr = new XMLHttpRequest();
        // 判断
        if(requestType.toLowerCase() === 'get'){ // get请求
            // var codeURL = encodeURI(url + '?' + getStrWithObject(paramObj));
            var codeURL = encodeURI(url + getStrWithObject(paramObj));
            xhr.open('get', codeURL, true);
            xhr.send();
        }else if(requestType.toLowerCase() === 'post'){ // post请求
            var codeParam = encodeURI(getStrWithObject(paramObj));
            xhr.open('post', url, false);
            // 设置请求头
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(codeParam);
        }
        // 监听服务器端响应
        xhr.addEventListener('readystatechange', function (ev2) {
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    // 请求成功
                    console.log('success');
                    successCallback && successCallback(xhr);
                    // 清除定时器
                    clearTimeout(timer);
                }else {
                    // 请求失败
                    console.log('failed')
                    failedCallback && failedCallback(xhr);
                }
            }
        });

        //  0 代表不限制请求的时间
        var timer = null;
        if(timeOut > 0){
            timer = setTimeout(function () {
                // 取消请求
                xhr.abort();
            }, timeOut);
        }
    };

    /**
     *  把对象转换成拼接字符串
     * @param {Object}paramObj
     */
    function getStrWithObject(paramObj) {
        // var resArr = [];
        // // 1. 转化对象
        // for (var key in paramObj) {
        //     var str = key + '=' + paramObj[key];
        //     resArr.push(str);
        // }
        // // 2. 拼接时间戳
        // resArr.push('random=' + getRandomStr());
        //
        // // 3. 数组转成字符串
        // return resArr.join('&');

        var resArr = [];
        // 1. 转化对象
        for (var key in paramObj) {
            var str = paramObj[key];
            resArr.push(str);
        }
        return resArr.join('/');
    }

    /**
     * 获取随机时间戳
     * @returns {number}
     */
    function getRandomStr() {
        return Math.random() + (new Date().getTime());
    }

    export default ajaxTool;

