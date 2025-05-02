import { JSDOM } from "jsdom";
import React, { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// 📌 **Tarayıcı ortamını Node.js içinde simüle etme**
const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
global.window = dom.window;
global.document = dom.window.document;

// 📌 **React bileşenini Node.js içinde render etme**
const MyComponent = () => <h1>Merhaba, Dünya!</h1>;
const html = renderToString(<MyComponent />);
console.log(html); // Sunucu tarafında bileşeni render eder

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-gray-200 flex justify-center">
        <Link to="/captcha">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Korunan Sayfaya Gidin
          </button>
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protectedPage" element={<ProtectedPage />} />
        <Route path="/captcha" element={<Captcha />} />
      </Routes>
    </BrowserRouter>
  );
}

const Home = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">Ana Sayfa</h1>
      <p>Korunan sayfaya gitmek için Captcha'yı geçmeniz gerekiyor.</p>
    </div>
  );
};

const ProtectedPage = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold">✅ Korunan Sayfa</h1>
      <Link to="/">
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Ana Sayfaya Dön
        </button>
      </Link>
    </div>
  );
};

const Captcha = () => {
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 6) + 1
  );
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document !== "undefined") {
      console.log("Tarayıcı ortamında çalışıyor.");
    } else {
      console.log("Node.js ortamında çalışıyor, document kullanılamaz.");
    }
  }, []);

  const checkCaptcha = () => {
    const isValid = Number(inputValue) === randomNumber;
    setMessage(isValid ? "✅ Doğru!" : "❌ Yanlış, tekrar deneyin.");

    if (isValid) {
      setTimeout(() => navigate("/protectedPage"), 1000);
    }
  };

  const refreshCaptcha = () => {
    setRandomNumber(Math.floor(Math.random() * 6) + 1);
    setInputValue("");
    setMessage("");
  };

  return (
    <div className="p-4 border rounded-md text-center bg-white shadow-md mt-10">
      <p className="text-lg font-bold">Lütfen {randomNumber} sayısını girin:</p>
      <input
        type="number"
        min="1"
        max="6"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border p-2 rounded-md w-20 text-center"
      />
      <button
        onClick={checkCaptcha}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 mt-2"
      >
        Kontrol Et
      </button>
      {message && <p className="mt-2 font-medium">{message}</p>}
      <button
        onClick={refreshCaptcha}
        className="mt-2 text-sm text-blue-500 underline"
      >
        Yenile
      </button>
    </div>
  );
};

export default App;
