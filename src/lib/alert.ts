"use client"

import SweetAlert, { SweetAlertOptions } from 'sweetalert2'
import withReactContent from "sweetalert2-react-content"

const swall = withReactContent(SweetAlert)

export const showToast = (options: SweetAlertOptions) => swall.fire({ ...options, timer: 3000, toast: true, position: 'top-right', showConfirmButton: false })
export const showConfirmation = (options: SweetAlertOptions) => swall.fire({
    ...options,
    showCancelButton: true,
    showConfirmButton: true,
    customClass: {
        confirmButton: "!btn !btn-primary !rounded-xl",
        cancelButton: "!btn !btn-error !rounded-xl !text-white"
    }
})