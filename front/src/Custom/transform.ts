import Storage from '../Service/Storage';
import { bizTypes, BizType } from './config';
import { NodeData, EdgeData } from '../types';

const storage = new Storage('graphin-studio');

if (!storage.get('bizTypes')) {
    storage.set('bizTypes', bizTypes);
}

//创建节点时触发
const transform = {
    nodes: (nodes: NodeData[]) => {
        return nodes.map(node => {
            // console.log('node-type------',node);
            const BizTypes = storage.get('bizTypes') as BizType[];
            // console.log('BizTypes----',BizTypes);
            const bizType = BizTypes.find(item => {
                return item.type === node.type;
            }) || { style: {} };

            const { type } = node;

            return {
                id: node.id,
                shape: type === 'phone' ? 'RectNode' : 'CircleNode',
                data: node,
                // style: bizType.style,
                label: node.label,
                style: {
                    icon: node.type,
                    fontFamily: 'graphin',
                    nodeSize: 18,
                },
            };
        });
    },
    edges: (edges: EdgeData[]) => {
        return edges.map(edge => {
            const { source, target } = edge;
            return {
                source,
                target,
                data: edge,
                label: edge.relative,
                // shape: 'CanonicalLineEdge',
                // style: {
                //     line: {
                //         dash: edge.lineType === 'dash' ? [2, 2] : 0,
                //     },
                // },
            };
        });
    },
    data: (data: { nodes: NodeData[]; edges: EdgeData[] }) => {
        return {
            nodes: transform.nodes(data.nodes),
            edges: transform.edges(data.edges),
        };
    },
};
export default transform;
