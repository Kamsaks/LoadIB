import UserCircle from '../assets/images/user-circle.png'

export default function Header() {
    return <header className="flex h-24 items-center px-5 bg-blue-950 shadow-lg "> 
        <input type="text " className="bg-blue-500 rounded-full mx-2 px-2 h-12 w-2/5" placeholder="Поиск... " >
            {/* <path stroke-linecap="round" stroke-linejoin="round" d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"></path> */}
        </input> 
        Header
        <img src = {UserCircle} alt = "logo" className='flex right-0' />
        <svg 
        viewBox="0 0 20 20" 
        fill="none" 
        aria-hidden="true" 
        class="hidden h-5 w-5 stroke-white dark:block">
        <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z"></path>
        </svg>
        
    
    </header>
}