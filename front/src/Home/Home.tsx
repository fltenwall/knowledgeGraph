import React from 'react';
import { Link } from 'react-router-dom';

/* 默认首页 */
const Home = () => {
    return (
        <div className="container">
            <div className="card">
                {/*<img*/}
                {/*    width="100%"*/}
                {/*    src="https://gw.alipayobjects.com/mdn/rms_00edcb/afts/img/A*EkJmRrmuJAgAAAAAAAAAAABkARQnAQ"*/}
                {/*    alt=""*/}
                {/*/>*/}
            </div>
            <div className="card">
                <Link to="/graphin-studio" className="card-item">
                    <div className="card-text">
                        {`
                            航天质量知识图谱
                            `}
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
