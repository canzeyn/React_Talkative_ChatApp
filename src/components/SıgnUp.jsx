import React from "react";
import { Input } from "@material-tailwind/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const SıgnUp = () => {
  const navigate = useNavigate();

  // router ile önceki sayfaya gitme
  const goToPreviousPage = () => {
    navigate(-1);
  };

  // formik işlemleri ve yup ile validasyon

  const initialValues = {
    email: "",
    password: "",
    passwordAgain: "",
    ad: "",
    soyad: "",
  };

  const validationSchema = Yup.object({
    ad: Yup.string()
      .min(2, "En az 2 karakter olmalıdır.")
      .required("Ad gereklidir."),
    soyad: Yup.string()
      .min(2, "En az 2 karakter olmalıdır.")
      .required("Soyad gereklidir."),
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin.")
      .required("E-posta adresi gereklidir."),
    password: Yup.string()
      .min(8, "Şifre en az 8 karakterden oluşmalıdır.")
      .required("Şifre gereklidir."),
    passwordAgain: Yup.string()
      .oneOf([Yup.ref("password"), null], "Şifreler eşleşmiyor.")
      .required("Şifre tekrarı gereklidir."),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const auth = getAuth(app); //burada auth firebase fonksiyonunu bir değişkene atıyoruz
      try {
        // Firebase ile kayıt olma
        const userCredential = await createUserWithEmailAndPassword(
          //burada kullanıcının girdiği bilgiler ile firebase kayıt olmasını sağlıyor ve bu bilgileri bir değişkene atılıyor
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user; //burada değişken içindeki user nesnesini alıyoruz burada kayıt olan kişinin bilgileri var

        // Firestore'da kullanıcı bilgilerini saklama
        const db = getFirestore(app);
        await setDoc(doc(db, "users", user.uid), {
          //burada user.id içinde her kullanıcının kendi id si var bu id benzersiz olur bu sayede kayıt olan kişini bilgilerini firestore içinde o kişinin idsnine göre eklenir
          firstName: values.ad, //burada kişinin girdiği ad alınır
          lastName: values.soyad, //burada kişinin girdiği soyad alınır
        });

        resetForm();

        console.log("User registered with ID: ", user.uid); //eğer işlemler başarılı olursa console kişinin id değeri yazdırılır
      } catch (error) {
        console.error("Error registering user: ", error); //hata verirse yapılan işlemler console hata yazdırılır
      }
    },
  });

  const facebookSignUp = async () => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth(app);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    } catch (error) {
      console.error(error);
    }
  };

  const signUpWithGoogle = async () => {
    // async kelimesini ekledim.
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider); // Burada da await kullanabilirsiniz.
      const user = result.user;
      const db = getFirestore(app);
      await setDoc(doc(db, "users", user.uid), {
        firstName: user.displayName,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const ErrorText = ({ children }) => (
    <div className="text-red-500">{children}</div>
  ); //burada kullandığım component uygulaması yup hata mesajlarını göstermediği için böyle bir bileşen tanımladım
  // ardından chldren içine prop olark girdim yani artık içine email hata mesajlarını gösterebilirz
  return (
    <div
      className="flex flex-col bg-cover bg-no-repeat  "
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/2874066/pexels-photo-2874066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
      }}
    >
      <div className=" items-start">
        <button
          onClick={goToPreviousPage}
          className="transform hover:scale-110 hover:-translate-y-1 duration-500 ease-in-out m-3"
        >
          <IoMdArrowRoundBack
            className="text-red-900"
            style={{ width: "50px", height: "50px" }}
          />
        </button>
      </div>

      <div className="GirisYapmaİkon flex flex-col justify-center items-center h-screen">
        <div className="border border-red-900 shadow-lg shadow-red-500/50  hover:shadow-red-800 rounded-xl p-8">
          {/* Talkative Sembol */}
          <div className="flex flex-col items-center space-y-2 mb-3">
            <h2 className=" bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 text-3xl">
              Sıgn Up
            </h2>
          </div>

          {/* Giriş İnputları */}
          <div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col items-center space-y-3"
            >
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-3 ">
                <Input
                  id="ad"
                  variant="outlined"
                  size="lg"
                  label="Adınızı Giriniz"
                  value={formik.values.ad}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.ad && formik.errors.ad && (
                  <ErrorText>{formik.errors.ad}</ErrorText> //burada hata mesajını prop olarak geçip bilişen içinde gösteriyoruz
                )}

                <Input
                  id="soyad"
                  variant="outlined"
                  size="lg"
                  label="Soyadınızı Giriniz"
                  value={formik.values.soyad}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.soyad && formik.errors.soyad && (
                  <ErrorText>{formik.errors.soyad}</ErrorText> //burada hata mesajını prop olarak geçip bilişen içinde gösteriyoruz
                )}
              </div>
              <Input
                id="email"
                size="lg"
                label="E-mail"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <ErrorText>{formik.errors.email}</ErrorText> //burada hata mesajını prop olarak geçip bilişen içinde gösteriyoruz
              )}

              <Input
                id="password"
                type="password"
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <ErrorText>{formik.errors.password}</ErrorText> //burada hata mesajını prop olarak geçip bilişen içinde gösteriyoruz
              )}

              <Input
                id="passwordAgain"
                type="password"
                label="Password again"
                value={formik.values.passwordAgain}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.passwordAgain && formik.errors.passwordAgain && (
                <ErrorText>{formik.errors.passwordAgain}</ErrorText> //burada hata mesajını prop olarak geçip bilişen içinde gösteriyoruz
              )}

              <button
                type="submit"
                disabled={!formik.isValid || !formik.dirty} //bu kısımda isValid formik fonskiyounu ile formun geçerli olup olmadığına bakılır dirty fonksiyonu ile inputların içerisindeki değerlerin ilk hallerinden farklı olup olmadığına bakar
                className="bg-gradient-to-r from-red-500 p-4 m-8 rounded-xl text-white hover:bg-red-800 hover:shadow-lg hover:shadow-red-500/50  ${!formik.isValid || !formik.dirty ? 'cursor-not-allowed' : ''}"
              >
                {" "}
                {/*  bu kısımda ise eğer inputlar geçerli değilse veya ilk hallerden farklı değillerse buton üstüne gelince cursor üzerinde engel işareti çıkar */}
                Sign Up
              </button>

              <button type="button"
                onClick={signUpWithGoogle}
                className="flex items-center bg-white hover:bg-gray-300 p-1 text-black  rounded-md mt-4 "
              >
                <FcGoogle className="mr-1" />
                Sign Up with Google
              </button>
              <button type="button"
                onClick={facebookSignUp}
                className=" flex items-center bg-blue-500 hover:bg-blue-800 p-1 text-white  rounded-md mt-4"
              >
                <BsFacebook className="mr-1" />
                Sign Up with Facebook
              </button>
            </form>

            <div className="flex  justify-center items-center mt-5">
              <p className="text-white">
                do you already have an account{" "}
                <Link to={"/giris_sayfası"} className="text-red-600">
                  login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SıgnUp;
