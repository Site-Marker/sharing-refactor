import { getCsrf } from "@/lib/utils"

const getHeaders = {
    'Content-type': 'application/json; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
}

const postHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrf()
})

export {
    getHeaders,
    postHeaders
}