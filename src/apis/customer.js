import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllCustomer = (token) => {
    return getWithToken('api/customers', token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addCustomerRequest = (token, data) => {
    return postWithToken('api/customers', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteCustomerRequest = (token, id) => {
    return deleteWithToken('api/customers', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchCustomerRequest = (token, id, customerEditting) => {
    return patchWithToken('api/customers', token, id, customerEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




