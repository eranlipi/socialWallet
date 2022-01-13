import React, { useEffect, useState, useContext } from "react";
import MyCard from "../../components/Cards/MyCard";
import { Grid, makeStyles } from "@material-ui/core";
import PersonCardGroup from "../../components/Cards/PersonCardGroup";
import { getUser } from "../../auth";
import api, { urls } from "../../helpers/api";
import { AlertContext } from "../../Routes";
import Search from "../../components/common/Search";
import { Pagination } from "@material-ui/lab";
import Loading from "../../components/common/Loading";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  subRoot: {
    display: "flex",
    justifyContent: "center",
    padding: 10,
  },
  myCardRoot: {
    marginTop: 8,
  },
  searchBox: {
    marginTop: 15,
  },
  seeMoreBtn: {
    padding: theme.spacing(3),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [user, setUser] = useState(getUser().user);
  const [profile, setProfile] = useState(null);
  const itemCount = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);
  const [cardList, setCardList] = useState([]);
  const [filteredCardList, setFilteredCardList] = useState(cardList);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.connection.getConnections().then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);

        const reCreatedUserList = res.data.map((element) => ({
          id: element.User.userID,
          connected: true,
          heading: `${element.User.firstName} ${element.User.lastName}`,
          subHeading: element.User.jobTitle
            ? element.User.jobTitle
            : "Job title is not assigned yet",

          url: urls.auth.loadProfileImage(element.User.userID),
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


  useEffect(() => {
    async function getUserDetails() {
      try {
        const response = await api.auth.getProfile();
        if (response.type === "success") {
          setProfile(response.data);
        } else {
          setAlertMsg(response.msg);
          setAlertType("error");
          setAlertOpen(true);
        };

      } catch (e) {
        setAlertMsg("Error retrieving profile data...");
        setAlertType("error");
        setAlertOpen(true);
      }
    }

    getUserDetails()
  }, []);

  const removeCardFromCardList = (id) => {
    const newCardList = cardList.filter((card) => card.id !== id);
    setCardList(newCardList);
  };


  return (
    <Loading loading={loading}>
      <Grid container className={classes.root}>
        <Grid container justifyContent="center" className={classes.searchBox}>
          <Search
            originalList={cardList}
            setFilteredList={setFilteredCardList}
            searchField={"heading"}
          />
        </Grid>
        <Grid container className={classes.subRoot}>
          <Grid item lg="3" className={classes.myCardRoot}>
            <MyCard
              heading={`${user.firstName} ${user.lastName}`}
              subHeading={profile && profile.jobTitle ? profile.jobTitle : ""}
              url={urls.auth.loadProfileImage(user.userID)}
            />
          </Grid>
          <Grid item lg="9">
            <PersonCardGroup
              cardList={filteredCardList.slice(
                itemCount * (currentPage - 1),
                itemCount * currentPage
              )}
              expandAll
              removeCardFromCardList={removeCardFromCardList}
            />
          </Grid>
        </Grid>
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
      </Grid>
    </Loading>
  );
};

export default Home;
