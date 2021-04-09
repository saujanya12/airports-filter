import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

export default function Filter({ searchFilter, setSearchFilter, setTypeFilter }) {

    const BlackCheckbox = withStyles({
        root: {
            color: grey[400],
            '&$checked': {
                color: grey[900],
            },
        },
        checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    const [typeFilter, setFilter] = useState({
        small: false,
        medium: false,
        large: false,
        heliport: false,
        closed: false,
        inYourFavorites: false
    });

    const handleChange = (event) => {
        setFilter({ ...typeFilter, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
        setTypeFilter(typeFilter);
    }, [typeFilter])

    return (
        <div className="d-flex justify-content-between flex-wrap">
            <div>
                <h6><b>Type</b></h6>
                <div className="d-flex flex-wrap">
                    <FormGroup row>
                        <FormControlLabel
                            control={<BlackCheckbox checked={typeFilter.small} onChange={handleChange} name="small" icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
                            label="Small"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={typeFilter.medium} onChange={handleChange} name="medium" icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
                            label="medium"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={typeFilter.large} onChange={handleChange} name="large" icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
                            label="large"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={typeFilter.heliport} onChange={handleChange} name="heliport" icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
                            label="heliport"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox checked={typeFilter.closed} onChange={handleChange} name="closed" icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} />}
                            label="closed"
                        />
                        <FormControlLabel
                            control={<BlackCheckbox icon={<CheckBoxOutlineBlankIcon fontSize="small" />} checkedIcon={<CheckBoxIcon fontSize="small" />} checked={typeFilter.inYourFavorites} onChange={handleChange} name="inYourFavorites" />}
                            label="In your favorites"
                        />
                    </FormGroup>

                </div>
            </div>
            
            <TextField
                id="standard-width"
                label="Filter by search"
                style={{ margin: 8 }}
                margin="normal"
                onChange={(e) => { setSearchFilter(e.target.value) }}
                value={searchFilter}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </div>
    )
}
