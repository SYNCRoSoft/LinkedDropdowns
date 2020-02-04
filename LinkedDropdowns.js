/*
  props: {
    dropdowns: [
      {
        label: 'First dropdown',
        items: [
          { id: '1', value: 'One', isDefault: false },
          { id: '2', value: 'Two [default]', isDefault: true }
        ]
      },
      {
        label: 'Second dropdown',
        items: [
          { id: '1', value: 'One.one', idParent: '1', isDefault: false },
          { id: '2', value: 'One.two [default]', idParent: '1', isDefault: true },
          { id: '3', value: 'Two.one [default]', idParent: '2', isDefault: true },
          { id: '4', value: 'Two.two', idParent: '2', isDefault: false }
        ]
      },
    ],
    size: 'small',
    variant: 'outlined',
    breakpoints: {
      xs: 6,
      md: 4,
      lg: 2
    }
  }
*/

import React, { Fragment, useState, useEffect, useRef } from 'react';
import 'typeface-roboto';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

let log = console.log;
console.log = function() {
  let args = Array.from(arguments);
  args.unshift('%cLinkedDropdowns says:', 'color: red;');
  log.apply(console, args);
}

export default function LinkedDropdowns(props) {
  const {
    dropdowns,
    size = 'medium',
    variant = 'standard',
    breakpoints = {xs: 4, md: 4, lg: 2},
    required = false,
    helperText = '',
    disableWarnings = false,
    value: defaultValue = ''} = props;
  const {xs, sm, md, lg, xl} = {...{xs: false, sm: false, md: false, lg: false, xl: false}, ...breakpoints};
  const [items, setItems] = useState(Array(dropdowns.length).fill([]));
  const [values, setValues] = useState(Array(dropdowns.length).fill(''));
  const [value, setValue] = useState(props.value ? props.value : '');
  const prevValues = usePrevious({values});

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  // populate dropdowns based on passed value prop to the component... hard work!
  useEffect(() => {
    var tempValues = values;
    if (typeof props.value !== 'undefined' && props.value !== '') {
      if (!disableWarnings)
        console.log('component was instantiated with value:', defaultValue, ', trying to populate dropdowns...');
      tempValues = ['10', '2', '2'];
    }
    setValues(tempValues);
  }, [defaultValue]);

  // at the beginning, populate only the first dropdown with all of its items
  useEffect(() => {
    if (!disableWarnings)
      console.log('component was instantiated with data:', dropdowns);
    let tempItems = [...items];
    tempItems[0] = dropdowns[0].items;
    setItems(tempItems);
  }, []);

  // the real linking dark magic happens here
  useEffect(() => {
    if ((values[0] === '') || (JSON.stringify(prevValues.values) === JSON.stringify(values)))
      return;

    let tempItems = [...items];
    let tempValues = [...values];

    for (var i = 0; i < values.length - 1; i++) {
      if (prevValues.values[i] !== values[i]) {
        for (var j = i + 1; j < values.length; j++) {
          tempItems[j] = [];
          tempValues[j] = '';
        }
        tempItems[i + 1] = dropdowns[i + 1].items.filter(item => item.idParent === values[i]);
        let defaultItems = tempItems[i + 1].filter(item => item.isDefault);
        if (defaultItems.length === 0 && !disableWarnings)
            console.log('There is no default item in this set:', tempItems[i + 1]);
        if (defaultItems.length === 1)
          tempValues[i + 1] = defaultItems ? defaultItems[0].id : ''
        if (defaultItems.length > 1 && !disableWarnings)
            console.log('Found more than one default item in this set:', tempItems[i + 1], 'and the matches are:', defaultItems);
        break;
      }
    }

    setValues(tempValues);
    setItems(tempItems);
    setValue(tempValues[tempValues.length - 1]);
  }, [values]);

  // invoking the component onChange(e) prop
  useEffect(() => {
    if (typeof props.onChange === 'function') {
      props.onChange(value);
    } else
      if (!disableWarnings)
        console.log('trying to call props.onChange with the new value =', {value}, 'but onChange prop is undefined or it is not a function');
  }, [value]);

  // handling the dropdowns onChange events
  const handleChange = (e) => {
    let tempValues = [...values];
    tempValues[+e.target.name] = e.target.value;
    setValues(tempValues);
  };

  return (
    <Fragment>
      <Divider />
      {dropdowns.map((dropdown, i) =>
        <Grid key={i} item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
          <TextField select fullWidth
            name={i + ''}
            size={size || 'small'}
            variant={variant || 'outlined'}
            label={dropdown.label || 'Dropdown #' + (i + 1)}
            value={values[i]}
            onChange={(e) => handleChange(e)}
            disabled={items[i].length === 0}
            required={required}
            error={required && (items[i].length === 0 || values[i] === '')}
            helperText={required && (items[i].length === 0) ? helperText : false}
          >
            {items[i].map(item =>
              <MenuItem key={item.id} value={item.id}>
                {item.value}
              </MenuItem>
            )}
          </TextField>
        </Grid>
      )}
      <Divider />
    </Fragment>
  );
}
