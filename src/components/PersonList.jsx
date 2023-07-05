import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { app } from "../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { useDispatch } from "react-redux";
import chatSlice from "../redux/chatSlice";
import { setReceiverId } from "../redux/chatSlice";
import {TbMessageForward} from "react-icons/tb"

const PersonList = () => {
  const [users, setUsers] = useState([]); //veri tabanından çektiğimiz verileri bu state içinde tutacağız
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      //asenkron bir fonksiyon yapıyoruz çünkü verilerin çekilmesini bekliyoruz
      try {
        const db = getFirestore(app);
        const usersCollection = collection(db, "users"); //users adlı collection içinden çekiliyor
        const userSnapshot = await getDocs(usersCollection); //collection içinden veriler getiriliyor 
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id, //id tek başına çekilyor 
          ...doc.data(), //diğer değerler spread operatörü ile çekiliyor 
        })); //id değeri javascript koduna dönüşmez json formatından bundan dolayı onu ayrı olark ilk başta çekilecek ardından kalan veriler çekilecek
        setUsers(userList);
      } catch (error) {
        console.log("Error fetching users: ", error);
      }
    };

    getUsers();
  }, []);

  const handleUserClick = (id) => {
    dispatch(setReceiverId(id)); //redux içindeki reducer çalıştırılır
  };

  return (
    <div className="flex flex-col">
      {users.map((user, index) => (
        <div
          className="flex flex-row border-b-2 border-orange-800 p-2 hover:bg-blue-gray-400 hover:cursor-pointer "
          key={index} onClick={() => handleUserClick(user.id)}
        >
          <h2 className="text-xl flex flex-row itmes-center justify-center">{user.firstName + " " + user.lastName}<TbMessageForward className="ml-3 mt-1 text-2xl text-red-400" /></h2>
          
        </div>
      ))}
    </div>
  );
};

export default PersonList;
