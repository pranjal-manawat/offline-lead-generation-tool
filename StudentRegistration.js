import React, { useEffect, useState } from "react";
import { Text, View, TextInput, StyleSheet, Button } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";
import axios from "axios";

const db = SQLite.openDatabase("StudentDB", "1.0");

const StudentRegistration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notSyncedValues, setNotSyncedValues] = useState([]);
  const netInfo = NetInfo.useNetInfo();

  const createTable = () => {
    console.log("inside createTable");
    db.transaction((tx) => {
      tx.executeSql("DROP TABLE IF EXISTS Students", []);
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Students(ID INTEGER PRIMARY KEY AUTOINCREMENT,FirstName TEXT,LastName TEXT,Email TEXT,IsSynced TEXT)",
        []
      );
    });
  };

  const insertionQuery = (firstName, lastName, email, isSynced) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Students(FirstName, LastName, Email, IsSynced) VALUES (?,?,?,?)",
        [firstName, lastName, email, isSynced],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log("Data inserted successfully");
          } else {
            console.log("failed");
          }
        }
      );
    });
  }

  const handleSubmitPress = async (netInfo) => {
    if (netInfo.isInternetReachable) {
      try {
        console.log("inside handleSubmitPress");
        axios
          .post("http://192.168.101.254:5000/userData", {
            firstName: firstName,
            lastName: lastName,
            email: email,
          })
          .then(()=>{
            insertionQuery(firstName, lastName, email, "true");
          })
          .catch((err) =>{
            insertionQuery(firstName, lastName, email, "false");
            console.log(err);
          });
      } catch (err) {
        console.log("ERROR ", err);
      }
    } else {
      insertionQuery(firstName, lastName, email, "false");
    }
  };

  useEffect(() => {
    createTable();
  }, []);

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * from Students WHERE IsSynced=?;",
            ["false"],
            (_, { rows: { _array } }) => {
              setNotSyncedValues(_array);
            }
          );
        });

        for (const notSyncedValue of notSyncedValues) {
          const { ID, firstName, lastName, email, isSynced } = notSyncedValue;
          axios
            .post("http://192.168.101.254:5000/userData", {
              ID: ID,
              firstName: firstName,
              lastName: lastName,
              email: email,
              isSynced: isSynced,
            })
            .then(() => {
              db.transaction((tx) => {
                tx.executeSql(
                  "UPDATE Students SET IsSynced=? WHERE ID=?",
                  ["true", ID],
                  (_, { rows: { _array } }) => console.log("_array ", _array)
                );
              });
            })
            .catch((err) => console.log(err));
        }
      } catch (err) {
        console.log("ERROR ", err);
      }
    }
  }, [netInfo.isInternetReachable]);

  return (
    <View>
      <Text style={styles.textCenter}>StudentRegistration Form</Text>
      <Text>Fill in the details below and click on submit</Text>
      <TextInput
        style={styles.input}
        onChangeText={(e) => setFirstName(e)}
        value={firstName}
        placeholder="Enter First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setLastName(e)}
        value={lastName}
        placeholder="Enter Last Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={(e) => setEmail(e)}
        value={email}
        placeholder="Enter Email Address"
      />
      <Button
        title="Submit"
        color="#000000"
        onPress={() => handleSubmitPress(netInfo)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 4,
  },
  textCenter: {
    textAlign: "center",
  },
});

export default StudentRegistration;
