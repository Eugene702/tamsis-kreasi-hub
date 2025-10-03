"use client"

type Props = {
    placeholder: string,
    label: string,
    data: {
        value: string,
        text: string
    }[]
}

const ComboboxFilter = ({ data }: { data: Props }) => {
    return <fieldset className="fieldset">
        <legend className="fieldset-legend">{ data.label }</legend>
        <select className="select select-bordered !rounded-xl">
            <option>{ data.placeholder }</option>
            { data.data.map((e, key) => <option key={key} value={e.value}>{ e.text }</option>) }
        </select>
    </fieldset>
}

export default ComboboxFilter