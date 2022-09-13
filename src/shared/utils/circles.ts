import { Circle } from "../models";

export const getCirclesNames = (circles: Circle[] | null, circleVisibility?: string[]): string => {
  if(!circles || !circleVisibility) {
    return '';
  }
  
  return (circles ?? [])?.filter(({id}) => circleVisibility?.includes(id)).map(({name}) => name).join(', ')
};