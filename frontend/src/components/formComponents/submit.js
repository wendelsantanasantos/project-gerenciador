import style from './submit.module.css'

function SubmitBtn({text}){
    return(<div >
        <button className={style.submitBtn}type="submit">{text}</button>
        </div>)
}

export default SubmitBtn