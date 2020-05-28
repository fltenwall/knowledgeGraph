import React, { useState } from 'react';
import { Button } from 'antd';
import { FoldingPanel } from '@com';
import NodeType from './NodeType';
import EdgeType from './EdgeType';
import Level from "./Level";
import { CheckboxValueType, DiffusePanelProps, DiffusePanelState } from './interface';
import './index.less';

let selectedNode = null;
let selectedEdge = null;
let diffuseType = null;
let neoType = null;
let selectNumber = 1;

const DiffusePanel: React.FC<DiffusePanelProps> = props => {
    const { dispatch, state: propsData } = props;
    const { selectedNodes } = propsData;
    const [state, setState] = useState<DiffusePanelState>({
        selectedNodeTypes: [],
        selectedEdgeTypes: [],
    });
    const { selectedNodeTypes, selectedEdgeTypes } = state;

    //selectedNodes是选中的节点
    // console.log('----------',selectedNodes);
    console.log('selectedNodeTypes',selectedNodeTypes);
    console.log('selectedEdgeTypes',selectedEdgeTypes);

    selectedNode = selectedNodeTypes;//选中扩散的实体
    selectedEdge = selectedEdgeTypes;//选中扩散的边
    diffuseType = selectedNodeTypes.length > 0 ? selectedNodeTypes : selectedEdgeTypes;
    neoType = selectedNodeTypes.length > 0 ? 'neoEntityType' : 'neoRel';//接口名
    console.log('diffuseType--',diffuseType);

    const handleChangeNodeTypes = (value: CheckboxValueType[]) => {
        setState({
            ...state,
            selectedNodeTypes: value,
        });
    };
    const handleChangeEdgeTypes = (value: CheckboxValueType[]) => {
        setState({
            ...state,
            selectedEdgeTypes: value,
        });
    };

    const selectLevel = (e) => {
        selectNumber = e.target.value;
    };

    const confirm = () => {
        dispatch({
            type: 'graph/diffuse',
            payload: {
                start: selectedNodes,
            },
        });
    };
    const data = [
        {
            title: '实体类型',
            children: <NodeType onChange={handleChangeNodeTypes} value={selectedNodeTypes} />,
        },
        {
            title: '关系类型',
            children: <EdgeType onChange={handleChangeEdgeTypes} value={selectedEdgeTypes} />,
        },
        {
            title: '选择层级',
            children: <Level onChange={selectLevel} />,
        },
    ];
    return (
        <div>
            {/* 可折叠面板 */}
            <FoldingPanel data={data} />
            <div
                style={{
                    width: propsData.drawer.width,
                }}
                className="diffuse_confirm_wrapper"
            >
                <Button className="diffuse_confirm_button" onClick={confirm}>
                    确定
                </Button>
            </div>
        </div>
    );
};

export default DiffusePanel;
export { selectedNode,selectedEdge,diffuseType,neoType,selectNumber };
