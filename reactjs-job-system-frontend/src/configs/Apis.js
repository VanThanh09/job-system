import axios from "axios";
import cookie from 'react-cookies';

const BASE_URL = "http://3.24.182.254/"

export const endpoints = {
    'login': "/o/token/",
    'register': '/users/',
    'profile': '/users/profile/',
    "verify_email": 'users/verify_email/',
    'categories': '/categories/',
    'posting': '/posting/',
    'job': (id) => `/posting/${id}/`,
    'cv': '/candidates/',
    'candidates': '/candidates/',
    'addCompany': '/companies/',
    'myCompanies': '/companies/my_companies/',
    'myComDetail': (id) => `/companies/${id}/my_company/`,
    'companyJobs': (id) => `/companies/${id}/my_company_jobs/`,
    'application': '/application/',
    'jobApplies': (id) => `/posting/${id}/applications/`,
    'jobAppliesCount': (id) => `/posting/${id}/count_applications/`,
    'changeApplyStatus': (id) => `/posting/${id}/change_applications/`,
    'follow': '/follow/',
    'unfollow': (id) => `/follow/${id}/`,
    'changePostingActive': (id) => `/posting/${id}/change_is_active/`,
    'recommendations': (id) => `/recommendations/?job_id=${id}`,
    'yourRecommendations': '/your-job-rcm/',
    'myNotis': '/notifications/',
    'readNoti': (id) => `/notifications/${id}/read_noti/`,
    'info_user': (id) => `/users/${id}/info_user/`,
    'my_convs': '/conversations/',
    'get_or_create_conv': '/conversations/get_or_create/',
    'messages': (id) => `/messages/?conversation_id=${id}`,
    'my_interviews': '/interviews/',
    'join_interview': (id) => `/interviews/${id}/join/`,
}

export const authApis = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${cookie.load('token')}`
    }
})

export default axios.create({
    baseURL: BASE_URL
})