interface tagProps{
    value?: string
}

export function Tag({value}:tagProps){
    return(
        <span 
            className="blue-700 bg-blue-100 font-bold px-4 py-1 rounded-lg"
         >
            {value}
        </span>
    )
}