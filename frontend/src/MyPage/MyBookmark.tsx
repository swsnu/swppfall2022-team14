import { useEffect } from "react"
import React from 'react';
import { fetchMyBookmarkCocktailList, selectCocktail } from "../store/slices/cocktail/cocktail"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../store"
import Item from "../common/Components/Item";
import { selectUser } from "../store/slices/user/user";
import { Grid, Stack } from "@mui/material";

const MyBookmark = () => {

    const cocktailState = useSelector(selectCocktail)
    const userState = useSelector(selectUser)
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        if (userState.isLogin && userState.token) {
            dispatch(fetchMyBookmarkCocktailList(userState.token))
        }
    }, [])

    return (
        <Stack sx={{ width: 1, py: 2 }}>
            <Grid container columns={4} spacing={3} sx={{ px: 1 }}>
                {(cocktailState.listStatus !== 'success' ? [] : cocktailState.cocktailList).map((cocktail) => (
                    <Grid key={cocktail.id} item xs={1}>
                        <Item 
                            image={cocktail.image}
                            name={cocktail.name} 
                            rate={cocktail.rate} 
                            type={cocktail.type} 
                            id={cocktail.id} 
                            tags={cocktail.tags} 
                            is_bookmarked={cocktail.is_bookmarked}
                            ABV={cocktail.ABV}
                            price_per_glass={cocktail.price_per_glass}
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    )
}


export default MyBookmark