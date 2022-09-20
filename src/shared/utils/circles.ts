import { Circle } from "../models";

export const getCirclesNames = (circles: Circle[] | null, circleIds?: string[]): string => {
  if(!circles || !circleIds) {
    return '';
  }
  
  return (circles ?? [])?.filter(({id}) => circleIds?.includes(id)).map(({name}) => name).join(', ')
};