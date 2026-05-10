import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/users/Login';
import Register from './components/users/Register';
import Profile from './components/users/Profile';
import MyUserReducer from './reducers/MyUserReducer';
import { useEffect, useReducer, useState } from 'react';
import { MyUserContext } from './configs/MyContexts';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Job from './components/jobs/Job';
import ScrollToTop from './components/layouts/ScrollToTop';
import { authApis, endpoints } from './configs/Apis';
import cookie from 'react-cookies';
import Jobs from './components/jobs/Jobs';
import Candidates from './components/candidates/Candidates';
import AddCompany from './components/company/AddCompany';
import MyCompanyDetail from './components/company/MyCompanyDetail';
import AddPosting from './components/company/AddPosting';
import PaymentSuccess from './components/layouts/PaymentSuccess';
import PaymentCancel from './components/layouts/PaymentCancel';
import JobApplies from './components/jobs/JobApplies';
import JobRecommendations from './components/jobs/JobRecommendations';
import Chat from './components/chat/Chat';
import ChatV2 from './components/chatv2/ChatV2';
import VerifyEmail from './components/users/VerifyEmail';
import CVEditor from './components/candidates/CvBuilder';
import InterviewPage from './components/chatv2/InterviewPage';
import YourRecommendationJob from './components/jobs/YourRecommendationJob';


// Các route không hiển thị Header/Footer
const NO_LAYOUT_ROUTES = ['/interview'];

// Wrapper đọc location, ẩn Header/Footer nếu là trang full-screen
function AppLayout({ children }) {
  const location = useLocation();
  const hideLayout = NO_LAYOUT_ROUTES.some(r => location.pathname.startsWith(r));

  useEffect(() => {
    if (hideLayout) {
      document.body.style.paddingTop = '0';
    } else {
      document.body.style.paddingTop = '';  // trả về giá trị CSS gốc (50px)
    }
    return () => {
      document.body.style.paddingTop = ''; // cleanup khi unmount
    };
  }, [hideLayout]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideLayout && <Header />}
      <ScrollToTop />
      {children}
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  let [user, dispatch] = useReducer(MyUserReducer, null);

  const loadUser = async () => {
    const token = cookie.load('token');
    if (token !== undefined) {
      try {
        let res = await authApis().get(endpoints['profile']);
        dispatch({
          type: 'login',
          payload: res.data
        });
      } catch (err) {
        console.error("Lỗi loaduser:", err);
      }
    } else
      return
  }

  useEffect(() => {
    loadUser();
  }, [])

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/job/:id" element={<Job />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/addcompany" element={<AddCompany />} />
            <Route path="/mycompany/:id" element={<MyCompanyDetail />} />
            <Route path="/addposting" element={<AddPosting />} />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/cancel' element={<PaymentCancel />} />
            <Route path='/jobapplies/:jobId' element={<JobApplies />} />
            <Route path="/recommendations/:jobId" element={<JobRecommendations />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chatv2" element={<ChatV2 />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/cvbuilder" element={<CVEditor />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/your-recommendation-job" element={<YourRecommendationJob />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </MyUserContext.Provider>
  );
}

export default App;
