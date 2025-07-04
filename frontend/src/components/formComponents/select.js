import style from './select.module.css';

function Select({ text, name, options, handleOnChange, value }) {
    return (
        <div className={style.form_control}>
            <label htmlFor={name}>{text}</label>
            <select
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value}
        
            >
                <option value="">Selecione uma opção</option>
                {options.map((option)=>(<option key={option.id} value={option.id}>{option.name}</option>))}
                
            </select>
        </div>
    );
}
export default Select;
