# LinkedDropdowns
React unlimited linked dropdowns

```
import LinkedDropdowns from './LinkedDropdowns';

<LinkedDropdowns
  dropdowns={[
    {
      label: 'Country',
      items: [
        { id: '10', value: 'Romania', isDefault: true },
        { id: '20', value: 'USA', isDefault: false }
      ]
    },
    {
      label: 'Region',
      items: [
        { id: '1', value: 'Bucharest', idParent: '10', isDefault: false },
        { id: '2', value: 'Tulcea', idParent: '10', isDefault: true },
        { id: '3', value: 'California', idParent: '20', isDefault: true },
        { id: '4', value: 'Texas', idParent: '20', isDefault: false }
      ]
    },
    {
      label: 'City',
      items: [
        { id: '1', value: 'Bucharest', idParent: '1', isDefault: true },
        { id: '2', value: 'Cataloi', idParent: '2', isDefault: false },
        { id: '3', value: 'Tulcea', idParent: '2', isDefault: true },
        { id: '4', value: 'Los Angeles', idParent: '3', isDefault: false },
        { id: '5', value: 'San Francisco', idParent: '3', isDefault: false },
        { id: '6', value: 'Dallas', idParent: '4', isDefault: false },
        { id: '7', value: 'Houston', idParent: '4', isDefault: true }
      ]
    }
  ]}
  breakpoints={{xs: 4, md: 4, lg: 2}}
  disableWarnings={true}
  helperText='Select previous option first'
  required={true}
  size='small'
  variant='outlined'
  value='2' // selected combination should be: Romania / Tulcea / Cataloi
  onChange={(e) => console.log(`LinkedDropdowns.onChange: value = '${e}'`)}
/>
```
