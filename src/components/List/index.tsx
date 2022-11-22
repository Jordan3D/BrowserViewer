import { memo } from "react";
import { useSelector } from "react-redux";
import { selectIsFiltering, selectVisibleMap } from "../../store";

import { Data, PropsItem, StoreItem } from '../../types';
import File from "../File";
import Folder from "../Folder";

  
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

  const ItemList = memo((props:{data: Data, expandedFolders?: ReadonlyArray<string>, rootPath: string}) => {
    const {data, rootPath, expandedFolders} = props;
    return <div>{data.map(item => {
      const path = `${rootPath}/${item.name}`;
      return <Item key={item.name} path={path} expandedFolders={expandedFolders} data={item}/>
    })}</div>
  });
  
  export default ItemList;