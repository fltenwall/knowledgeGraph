import $ from 'jquery';

type EdgeTypes = {
    /** 类型名称 */
    name: string;
    /** 类型 */
    nodeType: string;
    children?: Array<EdgeTypes>;
};

let neoType;
$.ajax({
    type: "get",
    url: `http://192.168.43.173:8081/neo/neoType`,
    async: false,
    success: function(result){
        neoType =  result;
        console.log('neoType',neoType);
    },
    failure:function (result) {
        throw new Error();
    },
});

let tempNodeTypes = [];

neoType.forEach((obj,index)=>{
    let childTypeArr = [];
    obj.children.forEach((child)=>{
        childTypeArr.push({name: child.name, nodeType: child.name})
    });

    let nodeObj = {
        name: obj.name,
        nodeType: obj.rel,
        children:childTypeArr
    };
    tempNodeTypes.push(nodeObj);
});

const edgeTypes : EdgeTypes[] = tempNodeTypes;

export default edgeTypes;
