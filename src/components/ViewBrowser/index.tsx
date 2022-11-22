import React from "react";
import {  Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { Data } from "../../types";
import ItemList from "../List";
import { filterByText, setData } from '../../store';
import './styles.css';

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
  
 export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(ViewBrowser);