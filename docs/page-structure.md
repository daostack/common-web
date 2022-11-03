# Page structure

## Template
Here is the structure of each component in the `components` folder (we can treat `pages` as `components` folder as well):
```
components/
  index.ts
  ComponentName/
    constants/
    types/
    utils/
    index.ts
    ComponentName.tsx
    ComponentName.module.scss
    ComponentName.spec.tsx
    ComponentName.stories.tsx
```
`index.ts` file in a component is an entrance point, any types also should be exported there.

## Example of the structure:
```
pages/
  commons/
  common/
  supportCommon/
    constants/
      flowStage.ts
      index.ts
    types/
      Form.ts
      index.ts
    utils/
      parseData.ts
      index.ts
    components/
      index.ts
      AboutTab/
        constants/
        types/
        utils/
        components/
          index.ts
          Card/
            index.ts
            Card.tsx
            Card.module.scss
            Card.spec.tsx
            Card.stories.tsx
        index.ts
        AboutTab.tsx
        AboutTab.module.scss
        AboutTab.spec.tsx
    index.ts
    SupportCommon.tsx
    SupportCommon.module.scss
```
