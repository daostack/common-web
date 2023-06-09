export abstract class Converter<BaseEntity, TargetEntity> {
  public abstract toBaseEntity: (targetEntity: TargetEntity) => BaseEntity;
  public abstract toTargetEntity: (baseEntity: BaseEntity) => TargetEntity;
}
