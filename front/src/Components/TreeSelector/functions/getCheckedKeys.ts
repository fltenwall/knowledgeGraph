import { chain } from 'lodash';
import { CheckboxDataProps, CheckboxValueType } from '../interface';

interface GroupedItemsProps {
    groups: Array<CheckboxDataProps>;
    key: string;
}

// 树节点的勾选状态
//点击关系扩散时触发
let checkedNodes = [];
const getCheckedKeys = (data: Array<CheckboxDataProps>, checkedList: Array<CheckboxValueType>) => {
    const checked: Array<string> = [];
    const halfChecked: Array<string> = [];
    const groupedItems = chain(data)
        .groupBy((item: CheckboxDataProps) => item.key)
        .map((groups: Array<CheckboxDataProps>, key: string) => {
            return {
                key,
                groups,
            };
        })
        .value();

    console.log('checkedList',checkedList);

    groupedItems.forEach((item: GroupedItemsProps) => {
        const { groups } = item;
        // console.log('item',item);
        const filterItems = groups.filter(e => checkedList.includes(e.value));

        if (groups.length === filterItems.length) {
            checked.push(item.key);
        }

        if (filterItems.length && groups.length > filterItems.length) {
            halfChecked.push(item.key);
        }
    });
    checkedNodes = checked;
    return {
        checked,
        halfChecked,
    };
};
export default getCheckedKeys;
export {checkedNodes};
