import $ from 'jquery';
type NodeTypes = {
    /** 类型名称 */
    name: string;
    /** 类型 */
    nodeType: string;
};
// const nodeTypes: NodeTypes[] = [
//     { name: '公司', nodeType: 'company' },
//     { name: '手机号码', nodeType: 'phone' },
//     { name: '邮箱', nodeType: 'mail' },
//     { name: '人员', nodeType: 'person' },
//     { name: '单位', nodeType: 'companytwo' },
//     { name: '外部供方主数据', nodeType: 'mdmsup' },
// ];

let neoLable;
$.ajax({
    type: "get",
    url: `http://192.168.43.173:8081/neo/neoLabel`,
    async: false,
    success: function(result){
        neoLable =  result;
        console.log(neoLable);
    },
    failure:function (result) {
        throw new Error();
    },
});

//可用,目前返回的数据缺name字段
let tempArr = [];
neoLable.forEach((value,index)=>{
    let nodeObj = { 'name': value.name, 'nodeType': value.label};
    tempArr.push(nodeObj);
});
console.log('tempArr',tempArr);

// const nodeTypes: NodeTypes[] = [
//     { name: '角色', nodeType: neoLable[0].label[0] },//role
//     { name: '外部供方主数据', nodeType: neoLable[1].label[0] },//mdmwsup
//     { name: '人员', nodeType: neoLable[2].label[0] },//person
//     { name: '单位', nodeType: neoLable[3].label[0] },//company
// ];

const nodeTypes: NodeTypes[] = tempArr;

export default nodeTypes;
