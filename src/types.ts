export interface IItem {
    type: string,
    name: string,
    children?: ReadonlyArray<IItem>
  }
  export  interface StoreItem {
    path: string
  }
  export type Data = ReadonlyArray<IItem>
  export interface PropsItem {
    data: IItem,
    path?: string,
    expandedFolders?: ReadonlyArray<string>
    isExpanded?: boolean;
  }