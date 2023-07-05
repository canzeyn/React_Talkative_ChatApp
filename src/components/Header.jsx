import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { app } from "../firebaseConfig";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ChatMenu from "./ChatMenu";
import { Drawer, Typography, IconButton } from "@material-tailwind/react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); //burada giriş yapan kullanıcı kontrol edilir ve giriş yaparsa bu state içine atılır

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const [aopen, setAOpen] = React.useState(false);
  const openDrawer = () => setAOpen(true);
  const closeDrawer = () => setAOpen(false);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      // bu fonksiyon ile kişi oturum açtığında çıktığında gibi durumlarda tektiklenir ve içerindeki işlemleri yapar
      if (user) {
        const db = getFirestore(app); //burada firestore bv adındaki değişkene atılıyor
        const userRef = doc(db, "users", user.uid); // "users" koleksiyonunda kullanıcının belgesine bir referans alır
        const fetchUser = async () => {
          const userDoc = await getDoc(userRef); // Kullanıcının belgesini alır
          setCurrentUser(userDoc.data()); //burada data() ile kişinin verilerini jsondan javascript koduna dönüşür ve state içine atar
        };
        fetchUser();
      }
    });
  }, []);

  const logout = async () => {
    try {
      await signOut(getAuth(app));
      navigate("/giris_sayfası");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between  border-gray-500 mt-2">
        <div className="flex items-center " >
          <button onClick={openDrawer}>
            <GiHamburgerMenu className="text-5xl uppercase fill-red-600" />
          </button>
        </div>

        <div className="flex flex-row justify-center items-center mr-2">
          <p className="ml-2">
            <span className="uppercase text-xl font-medium">
              {currentUser
                ? currentUser.firstName + " " + currentUser.lastName
                : ""}
            </span>{" "}
            (kullanan hesap)
          </p>

          <Menu>
            <MenuHandler>
              <Avatar
                className="cursor-pointer ml-2"
                size="lg"
                src="https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/02/28/14/hardy-getty2.jpg"
                alt="avatar"
                variant="rounded"
              />
            </MenuHandler>
            <MenuList>
            <MenuItem>
                {currentUser
                  ? currentUser.firstName + " " + currentUser.lastName
                  : ""} (siz)
              </MenuItem>
              <MenuItem>
               
                <button
                  onClick={handleOpen}
                  className="text-xl flex flex-row items-center text-red-600 mr-2"
                > Çıkış Yap
                  <FiLogOut className="ml-2" />
                </button>
              </MenuItem>
             
            </MenuList>
          </Menu>
         
        </div>
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          Çıkış Yapıyorsunuz !!<a href=""></a>
        </DialogHeader>
        <DialogBody divider>
          çıkış yapmak istediğinizden emin misiniz ?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>iptal</span>
          </Button>
          <Button variant="gradient" color="red" onClick={logout}>
            <span>Çıkış Yap</span>
          </Button>
        </DialogFooter>
      </Dialog>

      <Drawer open={aopen} onClose={closeDrawer}>
        <ChatMenu />
      </Drawer>
    </div>
  );
};

export default Header;
