export default function button ({OnClick,name}) {
    return(
        <button className="mr-10 ml-48 mt-6 mb-6
        bg-blue-950
        rounded-xl
        w-[13.4rem]
        h-[3.5rem]
        text-xl
        text-center
        text-white
        font-inter
        font-bold
        hover:bg-blue-700}"
        onClick={OnClick}>
        {name}
        </button>
    )
}