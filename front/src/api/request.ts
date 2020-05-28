import $ from 'jquery'

export const diffuseReq = (interfaceName,entityName,data)=>{
    $.ajax({
        url: `http://192.168.43.173:8081/neo/${interfaceName}/`,
        data:JSON.stringify({"entity":entityName}),
        type: "POST",
        traditional: true,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function(result){
            data =  result;
            console.log('dataEdge---',result);
        },
        failure:function (result) {
            console.log('result',result);
            throw new Error();
        },
    });
    console.log('data-----',data);
    return data;
};
