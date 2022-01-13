import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

const Search = ({ originalList, setFilteredList, searchField }) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");

  const filterOriginalList = () => {
    let filterList = [];
    const restList = [];

    if (searchQuery.trim() === "") {
      filterList = [...originalList];
    } else {
      originalList.forEach((obj) => {
        console.log(obj);
        if (
          obj[searchField]
            .toLowerCase()
            .startsWith(searchQuery.trim().toLowerCase())
        ) {
          filterList.push(obj);
        } else {
          restList.push(obj);
        }
      });
      restList.forEach((obj) => {
        if (
          obj[searchField]
            .toLowerCase()
            .search(` ${searchQuery.trim().toLowerCase()}`) !== -1
        ) {
          filterList.push(obj);
        }
      });
    }
    setFilteredList(filterList);
  };

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "Search" }}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value);
        }}
      />
      <IconButton
        className={classes.iconButton}
        aria-label="search"
        onClick={filterOriginalList}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default Search;
