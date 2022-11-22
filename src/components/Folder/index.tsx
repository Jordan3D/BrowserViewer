import React from "react";
import { PropsItem } from '../../types';
import ItemList from "../List";
import './styles.css';

class Folder extends React.PureComponent<PropsItem, { isExpanded: boolean, isReady: boolean }> {
    constructor(props: PropsItem) {
      super(props);
  
      this.state = {
        isReady: false,
        isExpanded: false
      };
      this.onExpand = this.onExpand.bind(this);
    }
    static getDerivedStateFromProps(props: PropsItem, state: { isExpanded: boolean, isReady: boolean }){
      return {
        ...state,
        isReady: true,
        isExpanded: state.isReady ? state.isExpanded : props.isExpanded
      }
    }
  
    onExpand() {
      this.setState((state) => ({ isExpanded: !state.isExpanded }))
    }
  
    componentDidUpdate(prevProps: Readonly<PropsItem>, prevState: Readonly<{ isExpanded: boolean; }>, snapshot?: any): void {
      if(this.props.isExpanded !== prevProps.isExpanded){
        this.setState({isExpanded: !!this.props.isExpanded});
      } else if (this.state.isExpanded !== prevState.isExpanded){
        this.setState({isExpanded: this.state.isExpanded});
      }
    }
  
    render() {
      const { data, path, expandedFolders } = this.props;
      const { isExpanded } = this.state;
      const { children, name } = data;
      return <div className='folder'>
        <div className='folder-label'>
          <button className='expander' onClick={this.onExpand}>{isExpanded ? '-' : '+'}</button>
          <div className='folder-name'>{name}</div>
        </div>
        {children && isExpanded &&
          <div className='folder-children'>
          <ItemList data={children} rootPath={path as string} expandedFolders={expandedFolders}/>
          </div>
        }
      </div>
    }
  }

  export default Folder;