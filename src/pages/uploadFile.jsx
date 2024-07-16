import {useState,useEffect} from "react"
import Button from "../components/button/button";



export default function UploadFile(){
    const [file,setFile] = useState([]);
    const [dragActive,setDragActive] = useState([false]);

    async function addFileToDB(fileDB) {
        let openRequest = indexedDB.open("Files", 1); 
    
        openRequest.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains('Files')) {
                let objectStore = db.createObjectStore('Files', { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: false });
            }
        };

        openRequest.onsuccess = function(event) {
            let db = event.target.result;
            let transaction = db.transaction('Files', 'readwrite');
            let objectStore = transaction.objectStore('Files');


            let checkRequest =  objectStore.index(`name`).get(fileDB.name);//objectStore.get(fileDB.name);//.index('name')

            checkRequest.onsuccess = () => {
                if (checkRequest.result) {
                    // Если файл с таким именем найден
                    console.log(checkRequest.result);
                    console.log(`File with name "${fileDB.name}" already exists.`);
                } else {
                    console.log(checkRequest.result);
                    // Если файл с таким именем не найден
                    let request = objectStore.add(fileDB);

                    request.onsuccess = function() {
                        console.log("Data added to the database:", request.result);
                    };

                    request.onerror = function() {
                        console.error("Error adding data:", request.error);
                    };
                }
                 }
        };
    
        openRequest.onerror = function() {
            console.error("Error opening database:", openRequest.error);
        };
    }

    const deleteDatabase= () => {
        let deleteRequest = indexedDB.deleteDatabase("Files");
    
        deleteRequest.onsuccess = function() {
            console.log("Database deleted successfully.");
        };
    
        deleteRequest.onerror = function() {
            console.error("Error deleting database:", deleteRequest.error);
        };
    
        deleteRequest.onblocked = function() {
            console.warn("Database deletion blocked. Close all other tabs or windows using the same database.");
        };
    }
    
    const handleChange = (e) => {
        e.preventDefault();
        if(e.target.files && e.target.files[0]){
            setFile([...e.target.files])
        }
    }

    const handleDrag = (e) => {
        e.preventDefault();
        setDragActive(true);
    }

    const handleLeave = (e) => {
        e.preventDefault();
        setDragActive(false);
    }

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]){
            setFile([...e.dataTransfer.files]);
        }
    }

    const handleReset = () => {
        setFile([]);
    }


    const downloadFiles = (files) => {
        files.forEach((file) => {
            // Создание URL для скачивания файла
            const url = window.URL.createObjectURL(file);

            // Создание ссылки и инициирование скачивания
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);  // Название файла
            document.body.appendChild(link);
            link.click();

            // Очистка ссылки и освобождение ресурсов
            link.remove();
            window.URL.revokeObjectURL(url);
        });
    };


    async function handleSubmit (e) {
        e.preventDefault();
        const data = new FormData();
        file.forEach(element => {
            data.append("file", file);
        });

        try {
            await fetch('https://jsonplaceholder.typicode.com/posts/1', {method: 'POST', body: data});
            downloadFiles(file);
            console.log('Файл успешно отправлен на сервер:', file.name);
        } catch (error) {
            console.error('Ошибка при отправке файла на сервер:', error);
            if (file && Array.isArray(file)) { // Проверка на существование и корректность file
                file.forEach(element => {
                    console.log("File:", element);
                    addFileToDB(element);
                });
            }
        }
    }

    async function syncFiles() {
        try{
            await fetch('https://jsonplaceholder.typicode.com/posts/1')
            console.log('Сеть доступна. Начинаем синхронизацию файлов.');
            const dbRequest = indexedDB.open('Files', 1);

            dbRequest.onsuccess = () => {
                const db = dbRequest.result;
                const transaction = db.transaction('Files', 'readwrite');
                const objectStore = transaction.objectStore('Files');
                const allFilesRequest = objectStore.getAll();

                allFilesRequest.onsuccess = () => {
                    const files = allFilesRequest.result;
                    downloadFiles(files);
                    for (const file of files) {
                        const formData = new FormData();
                        formData.append('file', file);

                        const deleteRequest = objectStore.delete(file.id);
                        deleteRequest.onsuccess = () => {
                            console.log('Файл успешно удален из IndexedDB:');
                        };
                        deleteRequest.onerror = (event) => {
                            console.error('Ошибка при удалении файла из IndexedDB:', event.target.errorCode);
                        };
                    }
                    try {
                        fetch('https://jsonplaceholder.typicode.com/posts/1');//, {method: 'POST',body: formData,}
                        console.log('Файл успешно отправлен на сервер:', file.name);

                    } catch (error) {
                        console.error('Ошибка при отправке файла на сервер:', error);
                    }
                }
                allFilesRequest.onerror = (event) => {
                    console.error('Ошибка при получении файлов из IndexedDB:', event.target.errorCode);
                };


                dbRequest.onerror = (event) => {
                    console.error('Ошибка при открытии базы данных:', event.target.errorCode);
                };
            }
        }catch(error){
            console.log('Сеть недоступна.');
        }



    }

    useEffect(() => {
        syncFiles()
    }, [])

    return (
            <div
                className="min-h-screen pt-24 pl-72 bg-blue-950 bg-[url('./assets/images/Отпечаток.png')] bg-no-repeat bg-[right_bottom_0.9rem]">

                <form
                    className={`form${dragActive ? "drag" : ""} bg-white shadow-lg border rounded-lg w-[43rem] h-[33rem] `}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleLeave}
                    onDrop={handleDrop}
                    onReset={handleReset}
                    onSubmit={handleSubmit}

                >

                    <h1 className="text-center text-3xl">Загрузка файлов</h1>
                    <label className="label ">
                        <>
                            <input
                                type="file"
                                className="input bg-gray-55 border rounded-sm mr-10 ml-10 mt-6 mb-6"
                                multiple={true}
                                onChange={handleChange}/>
                        </>
                    </label>
                    {file.length > 0 &&
                        <ul className="file-list scrollable-list scroll-my-2.5 my-2.5 overflow-auto max-h-20 mr-6 ml-6">
                            {file.map(({name}, id) => <li key={id}>{name}</li>)}
                        </ul>}
                    <Button OnClick={handleSubmit} name={"Загрузить"}/>
                    <Button OnClick={handleReset} name={"Сброс"}/>

                    <Button OnClick={deleteDatabase} name={"Очистить БД"}/>
                </form>
            </div>
    )

}

