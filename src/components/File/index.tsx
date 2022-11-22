import React from "react";
import { PropsItem } from '../../types';
import './styles.css';

class File extends React.PureComponent<PropsItem> {
    render() {
        const { data } = this.props;
        const { name } = data;
        return <div className='file'>
            <div className='file-name'>{name}</div>
        </div>
    }
}

export default File;