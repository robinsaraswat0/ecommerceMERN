import axios from "axios";

export const backendUrl = process.env.REACT_APP_BACKEND_URL;

const instance = axios.create({
    baseURL:backendUrl,
    withCredentials:true,
    headers:{
        "Access-Control-Allow-Origin":"*"
    }
})


const responseBody = (response) => response

const requests = {
    get: (url,body,options) =>
        instance.get(url,body,options).then(responseBody),

    post: (url,body,options) =>
        instance.post(url,body,options).then(responseBody),

    put: (url,body,options) =>
        instance.put(url,body,options).then(responseBody),

    delete: (url,options) => instance.delete(url,options).then(responseBody),
}

export const AuthServices = {
    login:(loginData,options) => requests.post("/api/v1/login",loginData,options),
    register:(userData,options) => requests.post("/api/v1/register",userData,options),
    loadUser:() => requests.get("/api/v1/me"),
    logoutUser: () => requests.get("/api/v1/logout"),
    updateProfile: (userData,options)=> requests.put("/api/v1/me/update",userData,options),
    updatePassword: (passwords,options) => requests.put("/api/v1/password/update",passwords,options),
    forgotPassword: (email,options) => requests.post(`/api/v1/password/forgot`,email,options),
    resetPassword: (token,password,options) => requests.put(`/api/v1/password/reset/${token}`,password,options),
    getAllUsers: () => requests.get("/api/v1/admin/users"),
    getUserDetails: (id) => requests.get(`/api/v1/admin/user/${id}`),
    updateUser: (id,userDetails,options) => requests.put(`/api/v1/admin/user/${id}`,userDetails,options),
    deleteUser: (id) => requests.delete(`/api/v1/admin/user/${id}`)
}

export const ProductServices = {
    getProduct: (link) => requests.get(link),
    getProductDetails: (id) => requests.get(`/api/v1/product/${id}`),
    getAdminProducts: () => requests.get("/api/v1/admin/products"),
    createProduct: (productData,options) => requests.post(`/api/v1/admin/product/new`,productData,options),
    updateProduct: (id,productData,options) => requests.put(`/api/v1/admin/product/${id}`,productData,options),
    deleteProduct: (id) => requests.delete(`/api/v1/admin/product/${id}`),
    newReview: (reviewData,options) => requests.put(`/api/v1/review`, reviewData, options),
    getAllReviews: (id) => requests.get(`/api/v1/reviews?id=${id}`),
    deleteReview: (reviewId,productId) => requests.delete(`/api/v1/reviews?id=${reviewId}&productId=${productId}`),
}

export const OrderServices = {
    createOrder: (order,options) => requests.post("/api/v1/order/new", order, options),
    myOrders: () => requests.get("/api/v1/orders/me"),
    getAllOrders: () => requests.get("/api/v1/admin/orders"),
    updateOrder:(id,order,options) => requests.put(`/api/v1/admin/order/${id}`,order,options),
    deleteOrder: (id)=> requests.delete(`/api/v1/admin/order/${id}`),
    getOrderDetails: (id) => requests.get(`/api/v1/order/${id}`),
}
