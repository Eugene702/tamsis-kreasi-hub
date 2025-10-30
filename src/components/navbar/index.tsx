import { getCategories } from "@/app/(publicPage)/category/action"
import { StatusCodes } from "http-status-codes"
import NavbarClient from "./NavbarClient"

const Navbar = async () => {
    const response = await getCategories()
    
    const categories = response.status === StatusCodes.OK 
        ? response.data?.map(cat => ({
            label: cat.name,
            href: `/category/${cat.slug}`
          })) || []
        : []

    return <NavbarClient categories={categories} />
}

export default Navbar
