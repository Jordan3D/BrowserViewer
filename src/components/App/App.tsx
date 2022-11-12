import React, {memo} from 'react';
import {  Dispatch } from '@reduxjs/toolkit';
import { Provider as ReduxProvider, connect, useSelector } from 'react-redux';
import './App.css';
import { Data, PropsItem, StoreItem} from '../../types';
import { store, selectIsFiltering, selectVisibleMap, filterByText, setData } from '../../store';

/* FYI
  Because in task description some components are described as classes I made them classes.
  Others are FCs
*/ 

const ItemList = memo((props:{data: Data, expandedFolders?: ReadonlyArray<string>, rootPath: string}) => {
  const {data, rootPath, expandedFolders} = props;
  return <div>{data.map(item => {
    const path = `${rootPath}/${item.name}`;
    return <Item key={item.name} path={path} expandedFolders={expandedFolders} data={item}/>
  })}</div>
});

const Item = ({ data, expandedFolders, path = ''}: PropsItem) => {
  const isFiltering = useSelector(selectIsFiltering);
  const visibleMap: Record<string, StoreItem> = useSelector(selectVisibleMap);

  const isExpanded = isFiltering ? !!visibleMap[path] : !!expandedFolders?.find(f => f === path);
  const displayItem = isFiltering ? !!visibleMap[path] : true;

  return displayItem && <>
    {data.type === 'FILE' && <File data={data}/>}
    {data.type === 'FOLDER' && <Folder data={data} isExpanded={isExpanded} expandedFolders={expandedFolders} path={path}/>}
  </>
};

class File extends React.PureComponent<PropsItem> {
  render() {
    const { data } = this.props;
    const { name } = data;
    return <div className='file'>
      <div className='file-name'>{name}</div>
    </div>
  }
}

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

interface ViewBrowserProps {data: Data, expandedFolders?:ReadonlyArray<string>, filterByText(text: string): void, setData(data: Data): void};
class ViewBrowser extends React.Component<ViewBrowserProps, {inputValue: string}> {
  private savedValue: {value: string};
  constructor(props: ViewBrowserProps){
    super(props);
    this.state = {inputValue: ''};
    this.savedValue = {value: ''};
    this.onChangeInput=this.onChangeInput.bind(this);
  }

  onChangeInput(e:React.ChangeEvent<HTMLInputElement>){
    const text = e.target.value?.toLowerCase();
    
        this.savedValue.value = text;
        setTimeout(async () => {
            if (text === this.savedValue.value) {
              this.props.filterByText(text);
            }
        }, 500)
    this.setState({inputValue: e.target.value})
  }

  async componentDidMount() {
    const response = await fetch('/data.json');
    const json = await response.json();
    this.props.setData(json);
  }

  render() {
    const {expandedFolders} = this.props;
    return <div className='view-browser'>
      <input type="text" onChange={this.onChangeInput}/>
      <ItemList data={this.props.data} rootPath={''} expandedFolders={expandedFolders}/>
    </div>
  }
}

const mapStateToProps = (state : any) => ({ data: state.data })

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setData: (data: Data) => dispatch(setData(data)),
  filterByText: (text: string) => dispatch(filterByText(text))
});

const WrappedViewBrowser = connect(
  mapStateToProps, 
  mapDispatchToProps
)(ViewBrowser);

function App() {
  return (
    <ReduxProvider store={store}>
      <WrappedViewBrowser expandedFolders={['/Common7']}/>
    </ReduxProvider>
  );
}

export default App;
