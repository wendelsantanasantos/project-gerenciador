import Input from "../formComponents/input";
import Select from "../formComponents/select";
import SubmitBtn from "../formComponents/submit";
import { useEffect, useState } from "react";
import style from './projectForm.module.css';
import SearchBar from '../Layout/searchBar';
import { VscAccount } from "react-icons/vsc";

function ProjectForm({ handleSubmit, btnText, projectData }) {
    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || { name: '', budget: 0, category: { id: '', name: '' } });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [members, setMembers] = useState([]); 

    useEffect(() => {
        // Fetch categories from the server
        fetch('http://localhost:5000/categories', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
            .then((resp) => {
                if (resp.status === 401) {
                    window.location.href = "/login";
                    return null;
                }
                return resp.json();
            })
            .then((data) => {
                setCategories(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        const projectWithMembers = {
          ...project,
          members: members
        };
        
        handleSubmit(projectWithMembers);
      };
      

    const handleChange = (e) => {
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const handleCategory = (e) => {
        setProject({
            ...project,
            category: {
                id: e.target.value,
                name: e.target.options[e.target.selectedIndex].text
            }
        });
    };

    function searchUsers(e) {
        const query = e.target.value;

        if (!query.trim()) {
            setFilteredUsers([]); // Limpa os resultados
            setSearchQuery(''); // Limpa o termo de pesquisa
            return; // Retorna para não fazer a requisição
        }

        setSearchQuery(query);

        fetch(`http://localhost:5000/usersSearch?UserName=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((resp) => resp.json())
            .then((data) => {
                setFilteredUsers(data);
            })
            .catch((erro) => console.log(erro));
    }

    const toggleMember = (userId) => {
    
        setMembers((prevMembers) => {
            if (prevMembers.includes(userId)) {
                return prevMembers.filter((id) => id !== userId);
            } else {
                return [...prevMembers, userId];
            }
        });
    };
    

    return (
        <div className={style.containerForm}>
            <form className={style.projectForm} onSubmit={submit}>
                <div className={style.projectFormInfo}>
                    <Input
                        type="text"
                        handleOnChange={handleChange}
                        value={project.name}
                        text="Nome do projeto"
                        name="name"
                        placeholder="Insira o nome do projeto"
                    />
                    <Input
                        type="text"
                        handleOnChange={handleChange}
                        value={project.budget}
                        text="Orçamento do projeto"
                        name="budget"
                        placeholder="Insira o orçamento do projeto"
                    />
                </div>

                <div className={style.projectFormSelect}>
                    <Input
                        type="text"
                        handleOnChange={handleChange}
                        value={project.description}
                        text="Descrição do projeto"
                        name="description"
                        placeholder="Insira a descrição do projeto"
                    />

                    <Select
                        text="Categoria do projeto"
                        handleOnChange={handleCategory}
                        name="category_id"
                        options={categories}
                        value={project.category ? project.category.id : ''}
                    />
                </div>

                <div className={style.dataContainer}>
                    <Input
                        type="date"
                        handleOnChange={handleChange}
                        value={project.start_date}
                        text="Início do projeto"
                        name="start_date"
                        placeholder="Insira a data de início do projeto"
                    />

                    <Input
                        type="date"
                        handleOnChange={handleChange}
                        value={project.end_date}
                        text="Fim do projeto"
                        name="end_date"
                        placeholder="Insira a data de fim do projeto"
                    />
                </div>

                <div className={style.teamContainer}>
    <div className={style.searchBarContainer}>
        <SearchBar handleSearch={searchUsers} />
        {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (

            <div  key={user.id}
            className={`${style.resultsList} ${members.includes(user.id) ? style.memberAdded : ''}`}
            onClick={() => toggleMember(user.id)}
        >
                <div className={style.userHeader}>
                    
                    <div className={style.avatarContainer}>
                    {user.img ? <img src={`http://localhost:5000${user.img}`} alt={user.name} /> : <VscAccount /> }
                    </div>

                    <p>
                    {user.name}
                    </p>
                </div>
                <span>{user.email}</span>

            </div>
            ))
        ) : (
            <p className={style.noResults}></p>
        )}
    </div>
                </div>


                <div className={style.projectFormSubmit}>
                    <SubmitBtn text={btnText} />
                </div>
            </form>
        </div>
    );
}

export default ProjectForm;
