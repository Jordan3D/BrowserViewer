import { createSlice, configureStore } from '@reduxjs/toolkit';
import filesAndFolders from '../data.json';
import { Data } from '../types';

const dataToVisibleMap = (tree: Data, parentPath: string, text: string): Record<string, boolean> => {
    let result:Record<string, boolean> = {};
    tree.forEach(item => {
      const path = parentPath + '/' + item.name;
      if(item.type === 'FILE' && item.name.indexOf(text)>=0){
        result[path] = true;
        result[parentPath] = true;
      }
      if(item.type === 'FOLDER' && item.children){
        result = {...result, ...dataToVisibleMap(item.children, path, text)};
        if(result[path]){
          result[parentPath] = true;
        }
      }
    });
    return result;
  }
  
  const dataSlice = createSlice({
    name: 'data',
    initialState: {
      visible: {},
      isFiltering: false
    },
    reducers: {
      filterByText: (state, {payload}) => {
        if(payload === ''){
          state.isFiltering = false
        } else {
          state.isFiltering = true;
          console.log(payload.toLowerCase());
          state.visible = dataToVisibleMap(filesAndFolders, '', payload.toLowerCase());
        }
      }
    }
  });

export const store = configureStore({
    reducer: dataSlice.reducer
  });



type RootState = ReturnType<typeof store.getState>

export const selectVisibleMap = (state: RootState) => state.visible;
export const selectIsFiltering = (state: RootState) => state.isFiltering;

export const { filterByText } = dataSlice.actions