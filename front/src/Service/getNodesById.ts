import getNodeProperties from './getNodeProperties';
/**
 *
 * @param nodeIds 节点的ID数组,输入ID处取出的数组
 * @param nodeType 节点的类型，例如:"UID""PHONE"等
 */
let idName = null;
let idType = null;

const getNodesById = (nodeIds: string[], nodeType = 'company',b) => {
    const nodes = nodeIds.map(id => {
        idName = id;
        // console.log('idName',idName);

        idType = nodeType;
        return {
            id: `${id}`,
            // id: `node-${id}`,   /* 节点ID */
            label: `node-${id}`,/* 节点label */
            type: nodeType, /* 实体类别 */
            properties: [],
            b:b,
        };
    });
    return getNodeProperties(nodes);
};


export default getNodesById;

//导出输入框输入的信息
export {idName,idType};
