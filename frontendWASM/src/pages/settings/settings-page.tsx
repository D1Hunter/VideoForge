import { FC, useState } from 'react';
import { MenuItem, Select, FormControl, Typography, Box, Button, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUseMultithread } from '../../store/reducers/settings-slice';

const SettingsPage: FC = () => {
  const dispatch = useDispatch();
  const settingValue = useSelector((state: RootState) => state.settingsReducer.useMutlithread);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value === 'true';
    dispatch(setUseMultithread(newValue));
  };

  const handleSave = () => {
    console.log('Selected Value:', settingValue);
    alert(`Setting saved: ${settingValue}`);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Use WASM multithread
      </Typography>
      <FormControl fullWidth>
        <Select
          id="setting-select"
          value={settingValue.toString()} // Приведення boolean до string для Select
          onChange={handleChange}
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;