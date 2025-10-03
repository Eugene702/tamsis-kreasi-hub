import { FiSearch } from "react-icons/fi"

const SearchInput = () => {
    return <fieldset className="fieldset">
        <legend className="fieldset-legend">Cari</legend>
        <label className="input input-bordered !rounded-xl">
            <FiSearch className="w-5 h-5 opacity-70" />
            <input type="text" />
        </label>
    </fieldset>
}

export default SearchInput