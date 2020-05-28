import { province, nodePropertiesSchema } from './Mock/nodePropertiesSchema';
import { NodeData } from '../types';
import { idName,idType } from './getNodesById';
import {nodeProperties} from '../Redux/reducer/diffuse'


interface Property {
    code: string;
    name: string;
    value: string;
}

interface SchemaProperty {
    code: string;
    name: string;
    dataType: string;
    desc: string;
    enumValueSchemaMap: object | null;
}

const nodePropertiesSchemaMap: object = nodePropertiesSchema.reduce((acc, curr) => {
    return {
        ...acc,
        [curr.type]: curr,
    };
}, {});

/* 属性匹配 */
/* 增加一个type参数，以判断传入的实体类别 */
const getPropertyValue = (property: SchemaProperty,type:string,node) => {
    const { code } = property;
    console.log('nodenodenodenodenodenode',node);
    //统一数据格式
    if(node.properties.length === 0){
        // let a = node.b[0];
        let a = node.b;
        let b = a[type];
        node.properties = b;
    }
    console.log('nodenodenodenodenodenode',node);

    if(type === "person"){
        switch (code) {
            case 'name':
                // console.log(b[0].person.name);
                return node.properties.name;
            case 'sex':
                return node.properties.sex;
            case 'address':
                return node.properties.address;
            case 'idcard':
                return node.properties.idcard;
            case 'degree':
                return node.properties.degree;
            case 'national':
                return node.properties.national;
            case 'record':
                return node.properties.record;
            case 'policy':
                return node.properties.policy;
            case 'department':
                return node.properties.department;
            case 'startime':
                return node.properties.startime;
            case 'endtime':
                return node.properties.endtime;
            default:
                return '...';
        }

    }else if(type === "company"){
        switch (code) {
            case 'organcode':
                // return b[0].company.organcode;
                return node.properties.organcode;
            case 'organame':
                return node.properties.organame;
            case 'jc':
                return node.properties.jc;
            case 'credit':
                return node.properties.credit;
            case 'institution':
                return node.properties.institution;
            case 'nation':
                return node.properties.nation;
            case 'province':
                return node.properties.province;
            case 'city':
                return node.properties.city;
            case 'district':
                return node.properties.district;
            case 'cent':
                return node.properties.cent;
            case 'category':
                return node.properties.category;
            default:
                return '...';
        }

    }else if(type === "mdmwsup"){
        switch (code) {
            case 'supcode':
                return node.properties.supcode;
            case 'supname':
                return node.properties.supname;
            case 'suojc':
                return node.properties.suojc;
            case 'credit':
                return node.properties.credit;
            case 'institution':
                return node.properties.institution;
            case 'tax':
                return node.properties.tax;
            case 'bank':
                return node.properties.bank;
            case 'bankcode':
                return node.properties.bankcode;
            case 'bankname':
                return node.properties.bankname;
            case 'bankdm':
                return node.properties.bankdm;
            case 'banklh':
                return node.properties.banklh;
            case 'province':
                return node.properties.province;
            case 'city':
                return node.properties.city;
            case 'nation':
                return node.properties.nation;
            case 'address':
                return node.properties.address;
            case 'tel':
                return node.properties.tel;
            case 'supls':
                return node.properties.supls;
            case 'companycategory':
                return node.properties.companycategory;
            case 'represent':
                return node.properties.represent;
            default:
                return '...';
        }
    }else if(type === 'role'){
        switch (code) {
            case 'rolename':
                return node.properties.rolename;
            case 'limitname':
                return node.properties.limitname;
            default:
                return '...';
        }
    }
};

/**
 *
 * @param nodes nodes节点数组
 * @param nodes
 */

const getProperties = (nodes: NodeData[]): NodeData[] => {
    // console.log('node1111111111111---------------',nodes);
    return nodes.map(node => {
        /* 取出节点（实体）类型 */
        /** node为单个节点
         * 格式为：{id:'',label:'',type:''}
         */
        const { type = ''} = node;

        /* 判断节点（实体）类型是否存在 */
        if (!nodePropertiesSchemaMap[type]) {
            return node;
        }
        /* 取出实体所有属性 */
        const schemaProperties = nodePropertiesSchemaMap[type].propertySchemaList;

        /**
         *  遍历属性列表
         *  property为取出的单个属性值
         */

        const propertiesMock = schemaProperties.map((property: SchemaProperty) => {
            return {
                // 渲染实体属性面板上的内容
                code: property.code,
                name: property.desc,
                value: getPropertyValue(property,type,node),
            };
        });

        return {
            // 更改所有节点属性值，包括扩散出的节点
            ...node,
            label: node.id,
            properties: propertiesMock,
        };

    });
};
export default getProperties;
