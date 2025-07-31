import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import storeRoom from '../zustand/room.zustand';

export default function DropDown() {
  const [team, setTeam] = React.useState('');
  const set = storeRoom(state => state.setTeam);

  const handleChange = (event) => {
    setTeam(event.target.value);
    set(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Team</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={team}
          label="Team"
          style={{color:'white'}}
          onChange={handleChange}
        >
          <MenuItem value={'bg-red-700'} style={{color:'red'}}>Red</MenuItem>
          <MenuItem value={'bg-blue-700'} style={{color:'blue'}}>Blue</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}