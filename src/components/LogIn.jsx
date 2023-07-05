import React from "react";
import { Input } from "@material-tailwind/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";

const LogIn = () => {
  const navigate = useNavigate();

  // router ile önceki sayfaya gitme
  const goToPreviousPage = () => {
    navigate(-1);
  };

  // formik işlemleri ve yup ile validasyon

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin.")
      .required("E-posta adresi gereklidir."),
    password: Yup.string().required("Şifre gereklidir."),
  });

  const ErrorText = ({ children }) => (
    <div className="text-red-500">{children}</div>
  ); //burada kullandığım component uygulaması yup hata mesajlarını göstermediği için böyle bir bileşen tanımladım
  // ardından chldren içine prop olark girdim yani artık içine email hata mesajlarını gösterebilirz

  const onSubmit = async (values, { resetForm }) => {
    const auth = getAuth(app); // Firebase auth nesnesi oluştur

    try {
      // Firebase ile giriş yap
      await signInWithEmailAndPassword(auth, values.email, values.password); //firebase ile giriş yapmak için
      console.log("giriş yapıldı")
      navigate("/mesajlaşma_arayüz")
    } catch (error) {
      console.log("hata var:", error);
    } finally {
      resetForm(); //formik içinden gelen bu fonksiyon ile form içleri boşaltılır
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });
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
            className="fill-red-900 hover:fill-red-500 duration-500"
            style={{ width: "50px", height: "50px" }}
          />
        </button>
      </div>

      <div className="GirisYapmaİkon flex flex-col justify-center items-center h-screen">
        <div className="border border-red-900 shadow-lg shadow-red-500/50  hover:shadow-red-800 rounded-xl p-8">
          {/* Talkative Sembol */}
          <div className="flex flex-col items-center space-y-2 mb-3">
            <h2 className=" bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 text-3xl">
              Sıgn In
            </h2>
          </div>

          {/* Giriş İnputları */}
          <div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                formik.handleSubmit(event);
            }}
              className="flex flex-col items-center space-y-3"
            >
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

              <button
              type="submit"
                disabled={!formik.isValid || !formik.dirty}
                className="bg-gradient-to-r from-red-500 p-4 m-8 rounded-xl text-white hover:bg-red-800 hover:shadow-lg hover:shadow-red-500/50 { !formik.isValid || !formik.dirty ? 'cursor-not-allowed' : '' }"
              >
                Sign In
              </button>

              {/* <button className="flex items-center  bg-white hover:bg-gray-300 p-1 text-black  rounded-md mt-4">
                <FcGoogle className="mr-1" />
                Sign In with Google
              </button>
              <button className=" flex items-center bg-blue-500 hover:bg-blue-800 p-1 text-white  rounded-md mt-4">
                <BsFacebook className="mr-1" />
                Sign In with Facebook
              </button> */}
              
            </form>

            <div className="flex  justify-center items-center mt-5">
              <p className="text-white">
                Don't have an account,{" "}
                <Link to={"/kayıt_olma_sayfası"} className="text-red-600">
                  register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
