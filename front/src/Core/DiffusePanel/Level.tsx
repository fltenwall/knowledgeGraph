import React from 'react';
import './index.less';

const Level = props => {
    return(
        <div id="selectedDiv">
            <select name="" id="" onChange={props.onChange} defaultValue={1}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
    )
};

export default Level;
