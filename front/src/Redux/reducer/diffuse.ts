import { updateChain } from 'immutability-helper-x';
import uniqueElementsBy from '../../Utils/helper';
import transform from '../../Custom/transform';
import getNodeProperties from '../../Service/getNodeProperties';
import { NodeData, EdgeData, GrapheneState } from '../../types';
import { diffuseType,neoType,selectedNode,selectedEdge,selectNumber } from "../../Core/DiffusePanel";
import $ from 'jquery';
import {diffuseReq} from './../../api/request';
import {selectNode} from "../../Events/node-click";

let nodeProperties = {};
const diffuseReducer = (state: GrapheneState, startNodes: NodeData[]) => {
    let dataEdge = null,tempArr = [],interfaceName;

    if(selectedNode.length > 0 && selectedEdge.length>0){
        alert('不能同时选择扩散关系和实体，请重新选择');
        return false;
    }

    if(selectedNode.length > 0){
        diffuseType.forEach((val,index)=>{
            let tempInfo = {"label1": selectNode.type, "entity": selectNode.id, "label2": diffuseType[index]};
            tempArr.push(tempInfo);
            interfaceName = "neoEntityType";
        });
    }

    if(selectedEdge.length>0){
        diffuseType.forEach((val,index)=> {
            let tempInfo = {"label1": selectNode.type, "entity": selectNode.id, "rel": diffuseType[index]};
            tempArr.push(tempInfo);
            interfaceName = "neoTypeEntity";
        })
    }

    if(selectNumber > 1){
        let tempInfo = {"label1": selectNode.type, "entity": selectNode.id, "level": selectNumber.toString()};
        tempArr.push(tempInfo);
        interfaceName = "neoLevel";
    }

    $.ajax({
        url: `http://192.168.43.173:8081/neo/${interfaceName}/`,
        data:JSON.stringify({"entity":tempArr}),
        type: "POST",
        traditional: true,
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function(result){
            dataEdge =  result;
            console.log('dataEdge---',result);
        },
        failure:function (result) {
            console.log('result',result);
            throw new Error();
        },
    });

    // diffuseReq(interfaceName,tempArr,dataEdge);

    let tempNodesArr = [],tempEdgesArr = [];

    if(interfaceName === "neoLevel"){
        let arr1 = [],arr2 = [],arr3 = [],arr4 = [];

        for(var index in dataEdge[0]) {
            arr4.push({[index]:dataEdge[0].index});

        }
        console.log('arr4',arr4);
        arr4.forEach((index)=>{
            if (index < selectNumber) {
                arr1.push(dataEdge[0].index);
            } else if (index < selectNumber * 2) {
                arr2.push(dataEdge[0].index)
            } else {
                arr3.push(dataEdge[0].index)
            }
        });

        console.log(arr1);
        console.log(arr2);
        console.log(arr3);

        tempNodesArr = [
            {id: "北京京航计算通讯研究所",type:"company",properties: [{address: "河北省石家庄市"}]},
            {id: "中国航天科工飞航技术研究所",type:"company",properties: [{address: "河北省石家庄市"}]},
        ];
        tempEdgesArr= [
            {source: "北京京航计算通讯研究所",target: startNodes[0].id,relative: "就职于", lineType: 'dash'},
            {source: "中国航天科工飞航技术研究所",target: "北京京航计算通讯研究所",relative: "属于", lineType: 'dash'}
        ];

    }else{
        dataEdge.forEach((item,index)=>{
            let tempNode = {id: dataEdge[index].n2.name,type:dataEdge[0].label[0],properties: dataEdge[index].n2};
            //交换了source和target的值，指向修正
            let tempEdge = {source: startNodes[0].id,target: dataEdge[index].n2.name,relative: dataEdge[index].rel.type, lineType: 'dash',};

            tempNodesArr.push(tempNode);
            tempEdgesArr.push(tempEdge);
        });
    }

    console.log('tempEdgesArr--------',tempEdgesArr);

    const {nodes,edges} = {
        nodes:tempNodesArr,
        edges:tempEdgesArr
    };

    const data2 = transform.data({
        nodes: getNodeProperties(nodes),
        edges,
    });

    const mergeNodes = uniqueElementsBy([...data2.nodes, ...state.data.nodes], (a: NodeData, b: NodeData) => {
        return a.id === b.id;
    });
    const mergeEdges = uniqueElementsBy([...data2.edges, ...state.data.edges], (a: EdgeData, b: EdgeData) => {
        return a.source === b.source && a.target === b.target;
    });

    const { layout } = state;

    return updateChain(state)
        .$set('data', {
            nodes: mergeNodes,
            edges: mergeEdges,
        })
        .$set('drawer.visible', false)
        .$set('drawer.type', '')
        .$set('layout', {
            name: layout.name,
            options: {
                ...layout.options,
                preset: {
                    name: layout.name,
                },
            },
        })
        .value();
};

export default diffuseReducer;
export {nodeProperties};
