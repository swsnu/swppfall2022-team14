import './ListPage.scss'
import React from 'react';
import { BiSearchAlt2 } from "react-icons/bi";
import Item from "./Item/Item";

const dummyListIem = [
    {
        id: 1,
        name: 'name',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 4.8
    }, {
        id: 2,
        name: 'name2',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 3.4
    }, {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },
    {
        id: 3,
        name: 'name3',
        image: 'https://www.acouplecooks.com/wp-content/uploads/2021/03/Blue-Lagoon-Cocktail-007s.jpg',
        introduction: '소개',
        recipe: '제조법',
        ABV: 42.4,
        price_per_glass: 3400,
        type: 'CS',
        author_id: 3,
        created_at: new Date(2022, 6, 17),
        updated_at: new Date(2022, 7, 14),
        rate: 5.0
    },

]

const ListPage = () => {

    //param
    return(
        <div className="list">
            <div className="list__navbar">
                For Nav Bar
            </div>
            <div className="list__content">
                <div className="list__content-up">
                    <div className="list__content-search-wrap">
                        <BiSearchAlt2 className="list__content-search-icon" />
                        <input className="list__content-search" placeholder={"search"}/>
                    </div>
                </div>
                <div className="list__content-down">
                    <div className="list__content-item-wrap">
                        {dummyListIem.map((cocktail) => <Item key={cocktail.id} image={cocktail.image}
                                                                            name={cocktail.name} rate={cocktail.rate} type={cocktail.type} id={cocktail.id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListPage