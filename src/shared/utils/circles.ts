import { Circle, Discussion } from "../models";

export const getCirclesNames = (circles: Circle[] | null, discussion: Discussion): string => (circles ?? [])?.filter(({id}) => discussion.circleVisibility?.includes(id)).map(({name}) => name).join(', ');