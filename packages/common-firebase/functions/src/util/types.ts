export type valueOf<T> = T[keyof T];

export interface IBaseEntity {
  /**
   * The main identifier of the common
   */
  id: string;

  /**
   * The time that the entity
   * was created
   */
  createdAt: Date;

  /**
   * The last time that the entity
   * was modified
   */
  updatedAt: Date;
}