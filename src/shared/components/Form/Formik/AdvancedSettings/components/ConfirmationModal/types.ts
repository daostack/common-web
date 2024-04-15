interface User {
  userId: string;
  userName: string;
}

export interface CircleChange {
  circleId: string;
  circleName: string;
  addedUsers: User[];
  removedUsers: User[];
}

export interface CommonCircleChange {
  commonId: string;
  commonName: string;
  removedUsers: User[];
  changes: CircleChange[];
}
