import Logo from '../assets/images/Отпечаток.png'
import Header from '../components/header'

export default function loginForm () {
    return (
        <>
        <Header />
        <div className="min-h-screen bg-white pt-24 pl-72">
            <img src={Logo} className="float-right" />
            <div className="container h-80 w-80 bg-white shadow-lg border rounded-lg fixed  ">
                <form className="text-center">
                    <h2 className="">Авторизация</h2>
                    <div className="">
                        <input type="text " className="bg-gray-55 border rounded-sm " placeholder="логин" />
                    </div>
                    <div className="">
                        <input type="text" className="bg-gray-55 border rounded-sm" placeholder="пароль"/>
                    </div>
                    <div>
                        <button className="button">Войти</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}