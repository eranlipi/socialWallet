import React, { useEffect, useState, useContext } from "react";
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import LocalButton from "../common/LocalButton";
import api from "../../helpers/api";
import { AlertContext } from "../../Routes";

const WalletManager = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState("");
  const { setAlertMsg, setAlertType, setAlertOpen } = useContext(AlertContext);

  const loadCards = () => {
    api.wallet.getCards().then((res) => {
      if (res.type === "success") {
        setCards(res.data);
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    });
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleAdd = () => {
    if (!newCard) return;
    api.wallet.addCard({ number: newCard }).then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);
        setNewCard("");
        loadCards();
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    });
  };

  const handleRemove = (id) => {
    api.wallet.removeCard(id).then((res) => {
      if (res.type === "success") {
        setAlertMsg(res.msg);
        setAlertType("success");
        setAlertOpen(true);
        loadCards();
      } else {
        setAlertMsg(res.msg);
        setAlertType("error");
        setAlertOpen(true);
      }
    });
  };

  return (
    <div>
      <List>
        {cards.map((card) => (
          <ListItem key={card.id} divider>
            <ListItemText primary={card.number} />
            <IconButton edge="end" onClick={() => handleRemove(card.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={8}>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <LocalButton
            variant="contained"
            color="primary"
            onClick={handleAdd}
          >
            Add
          </LocalButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default WalletManager;
