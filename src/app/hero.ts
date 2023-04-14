export interface Hero {
    id: number,
    name: string
}
export interface CRUDAction<T> {
    action: 'add' | 'update' | 'delete';
    data: T;
  }