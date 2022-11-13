import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import React from 'react';
import { fetchCustomCocktailList, fetchStandardCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import styles from "./MyPage.module.scss"


interface UserData {
    name: string;
    email: string;
    info: string;
}

const MyInfo = () => {
    const [dummyUserData, setDummyUserData] = useState<UserData>({
        name: "username",
        email: "email",
        info: "소개글"
    })
    return <div className={styles['right__main--info']}>
        <div className={styles.form}>
            <div className={styles.form__type}>Name</div>
            <input className={styles.form__field} value={dummyUserData.name} onChange={(e) => {}}></input>
        </div>
        <div className={styles.form}>
            <div className={styles.form__type}>Email</div>
            <div className={styles.form__field}>{dummyUserData.email}</div>
        </div>
        <div className={styles.form}>
            <div className={styles.form__type}>Info</div>
            <textarea className={styles.form__field} value={dummyUserData.info} onChange={(e) => {}}></textarea>
        </div>
        <div className={styles.form}>
            <div className={styles.form__type}>PW</div>
            <div className={styles.form__field}>
                <button className={styles['form__field--pw']}>비밀번호 변경</button>
            </div>

        </div>
    </div>
}


export default MyInfo