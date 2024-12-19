

import styles from './searchBar.module.css';
import Input from "../formComponents/input";

function SearchBar( { handleSearch }) {
  

    return (
        <div className={styles.searchBarContainer}>
            <Input
                type="text"
                text="Membros para a equipe"
                name="search"
                placeholder="Digite o nome do membro"
                handleOnChange={handleSearch}
            />
            
        </div>
    );
}

export default SearchBar;
