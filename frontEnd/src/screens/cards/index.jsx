import { Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import PersonCardGroup from "../../components/Cards/PersonCardGroup";
import Search from "../../components/common/Search";
import Pagination from "@material-ui/lab/Pagination";
import { useEffect } from "react";
import { AlertContext } from "../../Routes";
import api, { urls } from "../../helpers/api";
import Loading from "../../components/common/Loading";

const useStyles = makeStyles((theme) => ({
  header: { padding: theme.spacing(5) },
  searchBox: {
    padding: theme.spacing(5),
    paddingTop: "0",
  },
  seeMoreBtn: {
    padding: theme.spacing(3),
  },
}));

const Cards = () => {
  const classes = useStyles();
  const itemCount = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [cardList, setCardList] = useState([]);
  const [filteredCardList, setFilteredCardList] = useState(cardList);
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.connection.getDisconnectedUsers().then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);
        const reCreatedUserList = res.data.map((user) => ({
          id: user.userID,
          connected: false,
          heading: `${user.firstName} ${user.lastName}`,
          subHeading: user.jobTitle
            ? user.jobTitle
            : "Job title is not assigned yet",
          url: urls.auth.loadProfileImage(user.userID),
        }));
        setCardList(reCreatedUserList);
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setFilteredCardList(cardList);
  }, [cardList]);

  const removeCardFromCardList = (id) => {
    const newCardList = cardList.filter((card) => card.id !== id);
    setCardList(newCardList);
  };

  return (
    <Loading loading={loading}>
      <Grid container justifyContent="center" className={classes.header}>
        <Typography variant="h5">Card List</Typography>
      </Grid>
      <Grid container justifyContent="center" className={classes.searchBox}>
        <Search
          originalList={cardList}
          setFilteredList={setFilteredCardList}
          searchField={"heading"}
        />
      </Grid>
      <PersonCardGroup
        cardList={filteredCardList.slice(
          itemCount * (currentPage - 1),
          itemCount * currentPage
        )}
        removeCardFromCardList={removeCardFromCardList}
      />
      <Grid container justifyContent="center" className={classes.seeMoreBtn}>
        <Pagination
          color="primary"
          count={Math.ceil(filteredCardList.length / itemCount)}
          shape="rounded"
          size="large"
          showFirstButton
          showLastButton
          onChange={(e, pageNumber) => {
            setCurrentPage(pageNumber);
          }}
        />
      </Grid>
    </Loading>
  );
};

export default Cards;
